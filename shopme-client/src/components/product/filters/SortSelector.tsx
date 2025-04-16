import React from 'react';
import { Select } from 'antd';

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width: 150 }}
      options={[
        { label: 'Mới nhất', value: 'createdTime,desc' },
        { label: 'Giá tăng dần', value: 'price,asc' },
        { label: 'Giá giảm dần', value: 'price,desc' },
        { label: 'Đánh giá cao', value: 'averageRating,desc' },
        { label: 'Bán chạy', value: 'saleCount,desc' },
      ]}
    />
  );
};

export default SortSelector;
