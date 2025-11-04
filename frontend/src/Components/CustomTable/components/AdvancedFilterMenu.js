import React, { useEffect, useMemo, useState } from 'react';
import { getOperatorsForType } from '../constants/filterOperators';

const AdvancedFilterMenu = ({
    column,
    sortConfig,
    columnFilters,
    onSort,
    onClearSort,
    // excel filter additions
    dataForMenu,
    onApplyExcelFilter,
    onClearFilter
}) => {
    const filterConfig = columnFilters[column.field];

    // Build unique, case-insensitive values from currently filtered data (non-date)
    const uniqueOptions = useMemo(() => {
        if (column.type === 'date') return [];
        const set = new Map(); // lowercased -> original display
        if (!dataForMenu || !Array.isArray(dataForMenu)) return [];
        for (const row of dataForMenu) {
            const v = row[column.field];
            if (v === null || v === undefined || v === '') continue;
            const key = String(v).toLowerCase();
            if (!set.has(key)) set.set(key, String(v));
        }
        const arr = Array.from(set.values());
        if (column.type === 'number') {
            arr.sort((a, b) => {
                const na = parseFloat(a); const nb = parseFloat(b);
                if (isNaN(na) && isNaN(nb)) return 0;
                if (isNaN(na)) return 1;
                if (isNaN(nb)) return -1;
                return na - nb;
            });
        } else {
            arr.sort((a, b) => a.localeCompare(b));
        }
        return arr;
    }, [dataForMenu, column.field, column.type]);

    // Build date hierarchy tree when column is date
    const dateTree = useMemo(() => {
        if (column.type !== 'date') return null;
        const tree = new Map(); // year -> Map(month -> Set(day))
        if (!dataForMenu || !Array.isArray(dataForMenu)) return [];
        for (const row of dataForMenu) {
            const v = row[column.field];
            if (!v) continue;
            const d = new Date(v);
            if (isNaN(d.getTime())) continue;
            const y = d.getFullYear();
            const m = d.getMonth() + 1;
            const day = d.getDate();
            if (!tree.has(y)) tree.set(y, new Map());
            const months = tree.get(y);
            if (!months.has(m)) months.set(m, new Set());
            months.get(m).add(day);
        }
        const sorted = Array.from(tree.keys()).sort((a, b) => a - b).map(y => {
            const months = tree.get(y);
            const monthsArr = Array.from(months.keys()).sort((a, b) => a - b).map(m => {
                const days = months.get(m);
                const daysArr = Array.from(days.values()).sort((a, b) => a - b);
                return { month: m, days: daysArr };
            });
            return { year: y, months: monthsArr };
        });
        return sorted;
    }, [dataForMenu, column.field, column.type]);

    const BLANK_TOKEN = '__BLANK__';
    const [selected, setSelected] = useState(new Set());
    const [search, setSearch] = useState('');
    const [selectAll, setSelectAll] = useState(true);
    const [expandedYears, setExpandedYears] = useState(new Set());
    const [expandedMonths, setExpandedMonths] = useState(new Set()); // key `y-m`

    // Initialize selection from existing filter (in-operator)
    useEffect(() => {
        const s = new Set();
        const op = filterConfig?.conditions?.[0];
        if (op?.operator === 'in' && Array.isArray(op.value)) {
            op.value.forEach(v => s.add(v));
        } else {
            // default: all selected
            if (column.type === 'date') {
                dateTree?.forEach(y => {
                    s.add(`Y:${y.year}`);
                    y.months.forEach(m => {
                        const mm = String(m.month).padStart(2, '0');
                        s.add(`M:${y.year}-${mm}`);
                        m.days.forEach(d => s.add(`D:${y.year}-${mm}-${String(d).padStart(2, '0')}`));
                    });
                });
            } else {
                uniqueOptions.forEach(v => s.add(v));
                s.add(BLANK_TOKEN);
            }
        }
        setSelected(s);
        // Update selectAll state
        const total = column.type === 'date'
            ? (dateTree?.reduce((acc, y) => acc + 1 + y.months.length + y.months.reduce((da, m) => da + m.days.length, 0), 0) || 0)
            : (uniqueOptions.length + 1);
        setSelectAll(s.size === total);
    }, [filterConfig, uniqueOptions, column.type, dateTree]);

    const isIndeterminate = useMemo(() => {
        const total = column.type === 'date'
            ? (dateTree?.reduce((acc, y) => acc + 1 + y.months.length + y.months.reduce((da, m) => da + m.days.length, 0), 0) || 0)
            : (uniqueOptions.length + 1);
        return selected.size > 0 && selected.size < total;
    }, [selected, uniqueOptions, dateTree, column.type]);

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelected(new Set());
            setSelectAll(false);
        } else {
            let all;
            if (column.type === 'date') {
                all = new Set();
                dateTree?.forEach(y => {
                    all.add(`Y:${y.year}`);
                    y.months.forEach(m => {
                        const mm = String(m.month).padStart(2, '0');
                        all.add(`M:${y.year}-${mm}`);
                        m.days.forEach(d => all.add(`D:${y.year}-${mm}-${String(d).padStart(2, '0')}`));
                    });
                });
            } else {
                all = new Set([BLANK_TOKEN, ...uniqueOptions]);
            }
            setSelected(all);
            setSelectAll(true);
        }
    };

    const toggleItem = (value) => {
        const s = new Set(selected);
        if (s.has(value)) s.delete(value); else s.add(value);
        setSelected(s);
        const total = column.type === 'date'
            ? (dateTree?.reduce((acc, y) => acc + 1 + y.months.length + y.months.reduce((da, m) => da + m.days.length, 0), 0) || 0)
            : (uniqueOptions.length + 1);
        setSelectAll(s.size === total);
    };

    const toggleYear = (year) => {
        const key = `Y:${year}`;
        const s = new Set(selected);
        const y = dateTree?.find(n => n.year === year);
        if (!y) return;
        if (s.has(key)) {
            s.delete(key);
            y.months.forEach(m => {
                const mm = String(m.month).padStart(2, '0');
                s.delete(`M:${year}-${mm}`);
                m.days.forEach(d => s.delete(`D:${year}-${mm}-${String(d).padStart(2, '0')}`));
            });
        } else {
            s.add(key);
            y.months.forEach(m => {
                const mm = String(m.month).padStart(2, '0');
                s.add(`M:${year}-${mm}`);
                m.days.forEach(d => s.add(`D:${year}-${mm}-${String(d).padStart(2, '0')}`));
            });
        }
        setSelected(s);
    };

    const toggleMonth = (year, month, days) => {
        const key = `M:${year}-${String(month).padStart(2, '0')}`;
        const s = new Set(selected);
        if (s.has(key)) {
            s.delete(key);
            days.forEach(d => s.delete(`D:${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`));
        } else {
            s.add(key);
            days.forEach(d => s.add(`D:${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`));
        }
        setSelected(s);
    };

    const isYearState = (year) => {
        const y = dateTree?.find(n => n.year === year);
        if (!y) return { checked: false, indeterminate: false };
        let total = 1; let count = selected.has(`Y:${year}`) ? 1 : 0;
        y.months.forEach(m => {
            const mm = String(m.month).padStart(2, '0');
            total += 1 + m.days.length;
            if (selected.has(`M:${year}-${mm}`)) count += 1;
            m.days.forEach(d => { if (selected.has(`D:${year}-${mm}-${String(d).padStart(2, '0')}`)) count += 1; });
        });
        return { checked: count === total, indeterminate: count > 0 && count < total };
    };

    const isMonthState = (year, month, daysLen) => {
        const key = `M:${year}-${String(month).padStart(2, '0')}`;
        let total = 1 + daysLen; let count = selected.has(key) ? 1 : 0;
        for (let i = 1; i <= daysLen; i++) {
            if (selected.has(`D:${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`)) count += 1;
        }
        return { checked: count === total, indeterminate: count > 0 && count < total };
    };

    return (
        <div className="advanced-filter-menu" onClick={(e) => e.stopPropagation()}>
            {/* Sort Options */}
            <div className="filter-menu-section">
                <button
                    className="filter-menu-item"
                    onClick={() => onSort(column.field, column.type)}
                >
                    <span className="menu-icon">⬆</span>
                    Sort {column.type === 'number' ? '1 → 9' : column.type === 'date' ? 'Oldest → Newest' : 'A → Z'}
                </button>
                <button
                    className="filter-menu-item"
                    onClick={() => onSort(column.field, column.type)}
                >
                    <span className="menu-icon">⬇</span>
                    Sort {column.type === 'number' ? '9 → 1' : column.type === 'date' ? 'Newest → Oldest' : 'Z → A'}
                </button>
                {sortConfig.field === column.field && (
                    <button
                        className="filter-menu-item"
                        onClick={onClearSort}
                    >
                        <span className="menu-icon">⊗</span>
                        Remove Sort
                    </button>
                )}
            </div>

            {/* Excel-style checklist */}
            <div className="filter-menu-section">
                <div className="filter-section-title">Show rows where:</div>
                {column.type !== 'date' && (
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search values..."
                        className="filter-input"
                        style={{ margin: '6px 0' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
                <div className="menu-items-container" style={{ maxHeight: 220 }}>
                    <label className="menu-item" style={{ gap: 8 }}>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                            onChange={toggleSelectAll}
                        />
                        <span>(Select All)</span>
                    </label>
                    {column.type !== 'date' && (
                    <label className="menu-item" style={{ gap: 8 }}>
                        <input
                            type="checkbox"
                            checked={selected.has(BLANK_TOKEN)}
                            onChange={() => toggleItem(BLANK_TOKEN)}
                        />
                        <span>(Blanks)</span>
                    </label>
                    )}
                    {column.type !== 'date' && uniqueOptions
                        .filter(v => v.toLowerCase().includes(search.toLowerCase()))
                        .map(val => (
                        <label key={val} className="menu-item" style={{ gap: 8 }}>
                            <input
                                type="checkbox"
                                checked={selected.has(val)}
                                onChange={() => toggleItem(val)}
                            />
                            <span className="ellipsis">{val}</span>
                        </label>
                    ))}

                    {column.type === 'date' && dateTree?.map(y => {
                        const yState = isYearState(y.year);
                        const expanded = expandedYears.has(y.year);
                        return (
                            <div key={`y-${y.year}`} className="menu-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <button className="filter-operator-btn" onClick={() => { const s = new Set(expandedYears); if (expanded) s.delete(y.year); else s.add(y.year); setExpandedYears(s); }}>{expanded ? '▾' : '▸'}</button>
                                    <input type="checkbox" checked={yState.checked} ref={el => { if (el) el.indeterminate = yState.indeterminate; }} onChange={() => toggleYear(y.year)} />
                                    <span>{y.year}</span>
                                </div>
                                {expanded && y.months.map(m => {
                                    const key = `${y.year}-${String(m.month).padStart(2, '0')}`;
                                    const mState = isMonthState(y.year, m.month, m.days.length);
                                    const mexp = expandedMonths.has(key);
                                    const monthName = new Date(y.year, m.month - 1, 1).toLocaleString(undefined, { month: 'long' });
                                    return (
                                        <div key={`m-${key}`} style={{ paddingLeft: 22 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <button className="filter-operator-btn" onClick={() => { const s = new Set(expandedMonths); if (mexp) s.delete(key); else s.add(key); setExpandedMonths(s); }}>{mexp ? '▾' : '▸'}</button>
                                                <input type="checkbox" checked={mState.checked} ref={el => { if (el) el.indeterminate = mState.indeterminate; }} onChange={() => toggleMonth(y.year, m.month, m.days)} />
                                                <span>{monthName}</span>
                                            </div>
                                            {mexp && (
                                                <div style={{ paddingLeft: 22 }}>
                                                    {m.days.map(d => {
                                                        const token = `D:${y.year}-${String(m.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                                        if (!String(`${y.year} ${monthName} ${d}`).toLowerCase().includes(search.toLowerCase())) {
                                                            // basic search filter across concatenated text
                                                        }
                                                        return (
                                                            <label key={`d-${token}`} className="menu-item" style={{ gap: 8 }}>
                                                                <input type="checkbox" checked={selected.has(token)} onChange={() => toggleItem(token)} />
                                                                <span>{String(d).padStart(2, '0')}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="filter-menu-actions">
                <button
                    className="filter-apply-btn"
                    onClick={() => onApplyExcelFilter(column.field, Array.from(selected), column.type)}
                >
                    FILTER
                </button>
                <button
                    className="filter-clear-btn"
                    onClick={() => onClearFilter(column.field)}
                >
                    CLEAR
                </button>
            </div>
        </div>
    );
};

export default AdvancedFilterMenu;

