import React from 'react';
import { Transfer, Table, Checkbox } from 'antd';
import difference from 'lodash/difference';

const TableTransfer = ({ leftColumns, rightColumns, transferRef, ...restProps }) => {
    return (
    <Transfer {...restProps} ref={transferRef}>
        {({
            direction,
            filteredItems,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
            onItemSelectAll,
            onItemSelect,
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;
            const rowSelection = {
                getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                    .filter(item => !item.disabled)
                    .map(({ key }) => key);
                    const diffKeys = selected
                    ? difference(treeSelectedKeys, listSelectedKeys)
                    : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
                columnWidth: restProps.selectionWidth || 60,
                renderCell: (value, dataRow, index, originNode) => {
                    return {
                        props: {
                            style: dataRow.labelColor === 'none' ? {} : { background: dataRow.labelColor },
                        },
                        children: (
                            originNode
                        ),
                    }
                }
            }
            return (
            <Table
                pagination={restProps.pagination}
                showHeader={restProps.showHeader}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredItems}
                size="small"
                style={{ pointerEvents: listDisabled ? 'none' : null }}
                onRow={({ key, disabled: itemDisabled }) => ({
                    onClick: () => {
                        if (itemDisabled || listDisabled) return;
                        onItemSelect(key, !listSelectedKeys.includes(key));
                    },
                })}
            />
            );
        }}
    </Transfer>
)}

export default TableTransfer