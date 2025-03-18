import React, { useState } from 'react'
import { Card, Tabs } from 'antd'
import { CountryList } from '../../components/locations/CountryList'
import { StateList } from '../../components/locations/StateList'

const LocationsPage: React.FC = () => {
  const [selectedCountryId, setSelectedCountryId] = useState<
    number | undefined
  >(undefined)

  const handleCountrySelect = (country: any) => {
    setSelectedCountryId(country.id)
  }

  const items = [
    {
      key: 'countries',
      label: 'Countries',
      children: <CountryList onSelect={handleCountrySelect} />,
    },
    {
      key: 'states',
      label: 'States',
      children: <StateList countryId={selectedCountryId} />,
    },
  ]

  return (
    <div className='p-6'>
      <Card title='Location Management'>
        <Tabs
          defaultActiveKey='countries'
          items={items}
          onChange={(key) => {
            if (key === 'countries') {
              setSelectedCountryId(undefined)
            }
          }}
        />
      </Card>
    </div>
  )
}

export default LocationsPage
