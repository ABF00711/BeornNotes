# CustomTable Component Architecture

## Component Hierarchy

```
CustomTable (index.js)
│
├── LoadingOverlay
│   └── (Conditionally rendered when loading=true)
│
├── TableHeader
│   ├── Add Button
│   ├── Delete Button
│   ├── Layout Button
│   ├── Search Button
│   ├── Clear All Filters Button (conditional)
│   ├── Hide Columns Button
│   └── ColumnVisibilityMenu
│       ├── Checkbox List
│       └── Reset Button
│
├── <table>
│   ├── <thead>
│   │   ├── <tr> (Header Row)
│   │   │   ├── Checkbox Column Header
│   │   │   ├── Actions Column Header
│   │   │   └── TableColumnHeader (×N visible columns)
│   │   │       ├── Left Resize Border
│   │   │       ├── Header Content
│   │   │       │   ├── Column Title
│   │   │       │   ├── Sort Icon
│   │   │       │   └── Filter Menu Button
│   │   │       ├── Right Resize Border
│   │   │       └── AdvancedFilterMenu
│   │   │           ├── Sort Options
│   │   │           ├── Filter Conditions
│   │   │           │   ├── Operator Select
│   │   │           │   ├── Value Input
│   │   │           │   └── Remove Button
│   │   │           ├── Add Condition Button
│   │   │           └── Apply/Clear Buttons
│   │   │
│   │   └── TableFilterRow
│   │       ├── Empty Cell (Checkbox column)
│   │       ├── Empty Cell (Actions column)
│   │       └── Filter Input (×N visible columns)
│   │
│   └── TableBody
│       └── TableRow (×N filtered rows)
│           ├── Checkbox Cell
│           ├── Actions Cell
│           │   └── Edit Button
│           └── Data Cell (×N visible columns)
│
└── EmptyState
    └── (Conditionally rendered when no data)
```

## Data Flow

### State Management (Unidirectional Data Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                     CustomTable (index.js)                   │
│                                                               │
│  State:                                                       │
│  • displayColumns        • selectedRows                      │
│  • columnVisibilities    • sortConfig                        │
│  • columnFilters         • activeFilterMenu                  │
│                                                               │
│  Computed Data (useMemo):                                    │
│  • sortedData ──→ filteredAndSortedData                     │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Props ↓
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ↓                                ↓
┌──────────────┐              ┌──────────────────┐
│ TableHeader  │              │  Table Sections  │
│              │              │                  │
│ • Buttons    │              │ • Column Headers │
│ • Counters   │              │ • Filter Row     │
│ • Menu       │              │ • Data Rows      │
└──────┬───────┘              └────────┬─────────┘
       │                               │
       │ Callbacks ↑                   │ Callbacks ↑
       │                               │
       └───────────────┬───────────────┘
                       │
                       │ State Updates
                       ↓
              ┌────────────────┐
              │  State Setters │
              │  in index.js   │
              └────────────────┘
```

### Event Flow Example: Sorting

```
User clicks column header
        ↓
TableColumnHeader.onClick
        ↓
onSort(field, type) callback
        ↓
handleSort in index.js
        ↓
setSortConfig(newConfig)
        ↓
sortedData useMemo recomputes
        ↓
filteredAndSortedData useMemo recomputes
        ↓
TableBody receives new data
        ↓
TableRow components re-render with sorted data
```

### Event Flow Example: Filtering

```
User types in filter input
        ↓
TableFilterRow onChange
        ↓
handleQuickFilterChange in index.js
        ↓
setColumnFilters(newFilters)
        ↓
filteredAndSortedData useMemo recomputes
        ↓
TableBody receives new filtered data
        ↓
Row count updates in TableHeader
```

## Module Dependencies

```
index.js
├── utils/tableUtils.js
│   ├── formatCellValue()
│   ├── evaluateCondition()
│   └── initializeFilter()
│
├── components/LoadingOverlay.js
├── components/EmptyState.js
│
├── components/TableHeader.js
│   └── components/ColumnVisibilityMenu.js
│
├── components/TableColumnHeader.js
│   └── components/AdvancedFilterMenu.js
│       └── constants/filterOperators.js
│
├── components/TableFilterRow.js
│
└── components/TableBody.js
    └── components/TableRow.js
        └── utils/tableUtils.js
```

## Styling Architecture

```
style.css (Shared styles for all components)
│
├── Container & Layout
│   ├── .custom-table-container
│   ├── .custom-table-wrapper
│   └── .custom-table
│
├── Header Section
│   ├── .table-header-section
│   ├── .table-header-actions
│   ├── .header-action-btn
│   └── .column-menu-btn-header
│
├── Table Structure
│   ├── .custom-table-header
│   ├── .custom-table-header-cell
│   ├── .custom-table-body
│   ├── .custom-table-row
│   └── .custom-table-cell
│
├── Interactive Elements
│   ├── .column-resize-border
│   ├── .column-resize-border-left
│   ├── .filter-menu-btn
│   └── .sort-icon
│
├── Menus & Dropdowns
│   ├── .column-menu
│   ├── .advanced-filter-menu
│   └── .filter-row
│
└── States
    ├── .custom-table-loading
    ├── .custom-table-empty
    ├── .selected
    └── .dragging
```

## Key Design Patterns

### 1. **Container/Presentational Pattern**
- **Container** (`index.js`): Manages state and logic
- **Presentational** (components): Receive props, render UI

### 2. **Composition**
- Components composed of smaller components
- Single Responsibility Principle
- Reusable, testable units

### 3. **Controlled Components**
- All state managed in parent (`index.js`)
- Child components controlled via props
- Predictable data flow

### 4. **Callback Props**
- Events bubble up via callbacks
- Parent manages state updates
- Unidirectional data flow

### 5. **Utility Extraction**
- Pure functions in `utils/`
- Testable, reusable logic
- No side effects

### 6. **Constant Extraction**
- Shared constants in `constants/`
- Single source of truth
- Easy to maintain

## Performance Optimizations

### Current Optimizations
1. **useMemo** for derived data
   - `tableColumns`, `tableData`
   - `sortedData`, `filteredAndSortedData`
   - Prevents unnecessary recalculations

2. **Conditional Rendering**
   - Menus only render when visible
   - Empty state only when no data
   - Loading overlay only when loading

3. **Event Delegation**
   - Click-outside listeners on document
   - Cleanup in useEffect returns

### Future Optimizations
- React.memo for expensive components
- useCallback for handler functions
- Virtual scrolling for large datasets
- Debounce filter inputs
- Lazy load filter operators

## Testing Strategy

### Unit Tests
- `utils/tableUtils.js` functions
- Individual components with props
- Event handlers

### Integration Tests
- Component interactions
- State updates
- Data flow

### E2E Tests
- User workflows
- Sort → Filter → Select
- Resize → Reorder → Hide

## Accessibility Considerations

### Current
- Semantic HTML (`<table>`, `<th>`, `<td>`)
- Title attributes for tooltips
- Checkbox labels

### Improvements Needed
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader announcements
- High contrast mode support

## Browser Compatibility

- Modern browsers (ES6+)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Bundle Size Impact

### Before Modularization
- Single file: ~40KB (minified)
- Difficult to tree-shake

### After Modularization
- Main component: ~15KB
- Subcomponents: ~20KB total
- Utils/Constants: ~5KB
- **Total**: ~40KB (same size)
- **Benefit**: Better tree-shaking potential
- **Benefit**: Improved code splitting opportunities

