# CustomTable - Modular Component Architecture

## Overview
The CustomTable component has been refactored into a modular, maintainable architecture following React best practices and software engineering principles.

## Directory Structure

```
CustomTable/
├── index.js                    # Main orchestrator component (~200 lines)
├── style.css                   # Shared styles
├── README.md                   # This file
├── ARCHITECTURE.md             # Architecture documentation
│
├── components/                 # UI Components
│   ├── LoadingOverlay.js      # Loading state overlay
│   ├── EmptyState.js          # Empty data state
│   ├── TableHeader.js         # Top action bar & row counts
│   ├── ColumnVisibilityMenu.js # Show/hide columns dropdown
│   ├── TableColumnHeader.js   # Individual column header cell
│   ├── AdvancedFilterMenu.js  # Filter dropdown menu
│   ├── TableFilterRow.js      # Quick filter input row
│   ├── TableBody.js           # Table body wrapper
│   └── TableRow.js            # Individual data row
│
├── hooks/                      # Custom React Hooks
│   ├── useColumnResize.js     # Column resizing logic
│   ├── useColumnReorder.js    # Column reordering logic
│   ├── useColumnVisibility.js # Column visibility logic
│   ├── useRowSelection.js     # Row selection logic
│   ├── useSorting.js          # Sorting logic
│   └── useFiltering.js        # Filtering logic
│
├── constants/                  # Shared constants
│   └── filterOperators.js     # Filter operator definitions
│
└── utils/                      # Utility functions
    └── tableUtils.js          # Table utility functions

```

## Component Responsibilities

### Main Component (`index.js`)
**Role**: Orchestration and composition
- Composes custom hooks for functionality
- Manages column display state
- Delegates all complex logic to custom hooks
- Renders UI components with proper props

**Hooks Used**:
- `useColumnResize`: Column resizing
- `useColumnReorder`: Column drag & drop
- `useColumnVisibility`: Show/hide columns
- `useRowSelection`: Row selection management
- `useSorting`: Sort data by columns
- `useFiltering`: Filter data with conditions

**Local State**:
- `displayColumns`: Column configuration (only state in main component)

### UI Components

#### `LoadingOverlay.js`
**Purpose**: Display loading state
**Props**: None
**Styling**: `.custom-table-loading`

#### `EmptyState.js`
**Purpose**: Display empty data state
**Props**: None
**Styling**: `.custom-table-empty`

#### `TableHeader.js`
**Purpose**: Top action bar with buttons and row counts
**Props**:
- `selectedRowsCount`: Number of selected rows
- `totalRows`: Total rows in dataset
- `filteredRows`: Rows after filtering
- `activeFiltersCount`: Number of active filters
- `showColumnMenu`: Column menu visibility
- `columnMenuRef`: Ref for click-outside detection
- `displayColumns`: Column configuration
- `columnVisibilities`: Column visibility state
- `onToggleColumnMenu()`: Toggle column menu
- `onToggleColumnVisibility(field)`: Toggle column visibility
- `onResetColumnVisibility()`: Reset to default
- `onClearAllFilters()`: Clear all filters

**Features**:
- Add, Delete, Layout, Search action buttons
- Clear All Filters button (conditional)
- Show/Hide Columns button with dropdown
- Row count and selection info

#### `ColumnVisibilityMenu.js`
**Purpose**: Show/hide columns dropdown
**Props**:
- `showMenu`: Menu visibility
- `menuRef`: Ref for click-outside detection
- `displayColumns`: Column configuration
- `columnVisibilities`: Visibility state
- `onToggleVisibility(field)`: Toggle column
- `onReset()`: Reset to default

**Features**:
- Checkbox list for each column
- Reset to Default button

#### `TableColumnHeader.js`
**Purpose**: Individual column header with interactions
**Props**:
- `column`: Column configuration
- `index`: Column index
- `isDragging`: Dragging state
- `sortConfig`: Sort configuration
- `columnFilters`: Filter state
- `activeFilterMenu`: Active filter menu
- `onDragStart()`, `onDragOver()`, `onDrop()`: Drag & drop
- `onLeftResizeStart()`, `onRightResizeStart()`: Resize
- `onSort()`: Sort handler
- `onToggleFilterMenu()`: Toggle filter menu
- Filter-related callbacks

**Features**:
- Drag to reorder
- Bi-directional resize (left & right borders)
- Click to sort (with visual indicators)
- Filter menu button
- Advanced filter dropdown

#### `AdvancedFilterMenu.js`
**Purpose**: Advanced filter dropdown with operators and conditions
**Props**:
- `column`: Column configuration
- `sortConfig`: Sort configuration
- `columnFilters`: Filter state
- `onSort()`: Sort handler
- `onClearSort()`: Clear sort
- `onUpdateFilterCondition()`: Update condition
- `onAddFilterCondition()`: Add condition
- `onRemoveFilterCondition()`: Remove condition
- `onToggleFilterLogic()`: Toggle AND/OR
- `onApplyFilter()`: Apply filter
- `onClearFilter()`: Clear filter
- `onInitializeFilter()`: Initialize filter

**Features**:
- Sort options (Asc/Desc/Remove)
- Multiple filter conditions
- Type-specific operators (text/number/date)
- AND/OR logic between conditions
- Apply/Clear buttons

#### `TableFilterRow.js`
**Purpose**: Quick filter input row below headers
**Props**:
- `visibleColumns`: Visible columns
- `columnFilters`: Filter state
- `onFilterChange(field, value, type)`: Filter change handler
- `onClearFilter(field)`: Clear filter

**Features**:
- Type-specific inputs (text/number/date)
- Synced with advanced filter state

#### `TableBody.js`
**Purpose**: Table body wrapper
**Props**:
- `data`: Filtered and sorted data
- `visibleColumns`: Visible columns
- `selectedRows`: Selected row IDs
- `onRowClick()`: Row click handler
- `onRowSelect()`: Row selection handler
- `onEdit()`: Edit button handler

**Features**:
- Maps data to TableRow components

#### `TableRow.js`
**Purpose**: Individual data row
**Props**:
- `row`: Row data
- `rowIndex`: Row index
- `visibleColumns`: Visible columns
- `isSelected`: Selection state
- `onRowClick()`: Row click handler
- `onRowSelect()`: Selection handler
- `onEdit()`: Edit button handler

**Features**:
- Checkbox for selection
- Action buttons (Edit)
- Type-aware cell formatting
- Click handlers

### Constants

#### `filterOperators.js`
**Exports**:
- `TEXT_OPERATORS`: Text filter operators
- `NUMBER_OPERATORS`: Number filter operators
- `DATE_OPERATORS`: Date filter operators
- `getOperatorsForType(type)`: Get operators for column type

### Custom Hooks

#### `useColumnResize.js`
**Purpose**: Handle column width resizing
**Returns**:
- `resizingColumn`: Currently resizing column index
- `handleRightResizeStart()`: Start right-edge resize
- `handleLeftResizeStart()`: Start left-edge resize

#### `useColumnReorder.js`
**Purpose**: Handle column drag & drop reordering
**Returns**:
- `draggedColumn`: Currently dragged column index
- `handleDragStart()`: Drag start handler
- `handleDragOver()`: Drag over handler
- `handleDrop()`: Drop handler

#### `useColumnVisibility.js`
**Purpose**: Manage column visibility and menu
**Returns**:
- `columnVisibilities`: Visibility state object
- `showColumnMenu`: Menu visibility
- `columnMenuRef`: Ref for click-outside
- `setShowColumnMenu()`: Toggle menu
- `toggleColumnVisibility()`: Toggle column
- `resetColumnVisibility()`: Reset all
- `getVisibleColumns()`: Get filtered columns

#### `useRowSelection.js`
**Purpose**: Handle row selection with checkboxes
**Returns**:
- `selectedRows`: Set of selected row IDs
- `handleSelectAll()`: Select/deselect all
- `handleRowSelect()`: Select/deselect row
- `getSelectionState()`: Get selection state

#### `useSorting.js`
**Purpose**: Handle column sorting
**Returns**:
- `sortConfig`: Current sort configuration
- `sortedData`: Sorted data array
- `handleSort()`: Sort by column
- `handleClearSort()`: Clear sorting

#### `useFiltering.js`
**Purpose**: Handle advanced filtering
**Returns**:
- `columnFilters`: Filter configurations
- `activeFilterMenu`: Active menu field
- `filteredData`: Filtered data array
- `toggleFilterMenu()`: Toggle filter menu
- `updateFilterCondition()`: Update condition
- `addFilterCondition()`: Add condition
- `removeFilterCondition()`: Remove condition
- `toggleFilterLogic()`: Toggle AND/OR
- `applyColumnFilter()`: Apply filter
- `clearColumnFilter()`: Clear filter
- `clearAllFilters()`: Clear all filters
- `handleQuickFilterChange()`: Quick filter handler

### Utilities

#### `tableUtils.js`
**Functions**:
- `formatCellValue(value, columnType)`: Format cell value by type
- `evaluateCondition(cellValue, operator, filterValue, columnType)`: Evaluate filter condition
- `initializeFilter(field, columnType)`: Initialize filter configuration

## Benefits of Modular Architecture

### 1. **Separation of Concerns**
- Each component has a single, well-defined responsibility
- State management separated from UI rendering
- Business logic (utils) separated from presentation
- **Custom hooks** encapsulate complex stateful logic

### 2. **Reusability**
- Components can be reused independently
- **Custom hooks** can be reused in other tables
- Utility functions shared across components
- Constants prevent duplication

### 3. **Maintainability**
- Easy to locate and fix bugs
- Changes isolated to specific hooks/components
- Clear component boundaries
- **Main component is only ~200 lines** (was 1000+)

### 4. **Testability**
- Each component can be tested in isolation
- **Custom hooks** can be tested independently
- Props-based interface makes mocking easy
- Pure utility functions are deterministic

### 5. **Scalability**
- Easy to add new features (new hooks/components)
- Easy to extend existing components
- Clear patterns to follow
- **Hooks** can be composed and combined

### 6. **Code Organization**
- Related code grouped together
- Consistent file structure
- Easy navigation and discovery
- **No function exceeds 60 lines**

### 7. **Performance**
- Smaller components are easier to optimize
- React can better optimize rendering
- Clearer memoization opportunities
- **Hooks** use useMemo/useCallback internally

### 8. **Developer Experience**
- **No long functions** - easy to read
- Clear interfaces between modules
- Self-documenting code structure
- Easy to onboard new developers

## Usage Example

```javascript
import CustomTable from './Components/CustomTable';

function MyPage() {
    const columns = [
        { field: 'name', header: 'Name', width: '200px', type: 'text' },
        { field: 'age', header: 'Age', width: '100px', type: 'number' },
        { field: 'joinDate', header: 'Join Date', width: '150px', type: 'date' }
    ];

    const data = [
        { id: 1, name: 'John Doe', age: 30, joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', age: 25, joinDate: '2024-02-20' }
    ];

    const handleEdit = (row) => {
        console.log('Edit', row);
    };

    const handleSelectionChange = (selectedIds) => {
        console.log('Selected', selectedIds);
    };

    return (
        <CustomTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onSelectionChange={handleSelectionChange}
            loading={false}
        />
    );
}
```

## Features

✅ Column Reordering (drag & drop)
✅ Column Resizing (bi-directional)
✅ Column Visibility (show/hide)
✅ Row Selection (checkbox with select all)
✅ Sorting (asc/desc/none, type-aware)
✅ Advanced Filtering (operators, conditions, AND/OR)
✅ Quick Filtering (input row)
✅ Type-aware Rendering (text/number/date)
✅ Loading State
✅ Empty State
✅ Action Buttons (Add/Delete/Layout/Search)
✅ Responsive Design
✅ Professional UI/UX

## Future Enhancements

- [ ] Implement Layout save/load functionality
- [ ] Implement Search save/load functionality
- [ ] Add pagination support
- [ ] Add virtual scrolling for large datasets
- [ ] Add column grouping
- [ ] Add export functionality
- [ ] Add keyboard navigation
- [ ] Add accessibility (ARIA labels)

