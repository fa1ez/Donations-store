import React, { useState, useEffect } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row,Button } from 'antd';

interface Reference {
  type: {
    id: string;
    prefix: string;
  };
  number: number;
  text: string;
}

interface Location {
  id: string;
  name: string;
}

interface Theme {
  id: string;
  name: string;
}

interface Currency {
  id: string;
  symbol: string;
}

interface Price {
  currency: Currency;
  amount: number;
  text: string;
}

interface Status {
  id: string;
  name: string;
}

interface Data {
  id: string;
  reference: Reference;
  name: string;
  location: Location;
  theme: Theme;
  price: Price;
  status: Status;
}


export default function Body() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data[]>([]);
  const [filter, setFilter] = useState<Data[]>(data);
  const [statuses, setstatuses] = useState<Status[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const statres = await fetch(`https://n3o-coding-task-react.azurewebsites.net/api/v1/donationItems/statuses`);
        setstatuses(await statres.json());

        const res = await fetch(`https://n3o-coding-task-react.azurewebsites.net/api/v1/donationItems/all`);
        const data: Data[] = await res.json();
        setData(data);
        setFilter(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setLoading(!(data.length));
  }, [data]);

  const handleButtonClick = (statusId: string) => {
    setSelectedStatusId(statusId);
  };
  
  return (
    <div>
      <div style={{ display: "flex" }}>
        {statuses.map((stat) => (
          <div style={{ paddingLeft: "16px" }} key={stat.id}>
            <Button
              type={selectedStatusId === stat.id ? 'primary' : 'default'}
              onClick={() => {
                setFilter(data.filter((x) => x.status.id === stat.id));
                handleButtonClick(stat.id);
              }}
            >
              {stat.name}
            </Button>
          </div>
        ))}
      </div>
      <Row gutter={16}>
        {filter.map((dt) => (
          <Col span={6}>
            <Card title={dt.name} bordered={false} style={{ width: 300, marginTop: 16, marginLeft:"16px", backgroundColor:"#cccccc"}}>
              <p>Reference: {dt.reference?.text ?? 'N/A'}</p>
              <p>Price: {dt.price?.amount ?? 'N/A'}</p>
              <p>Status: {dt.status?.name ?? 'N/A'}</p>
              <p>Location: {dt.location?.name ?? 'N/A'}</p>
              <p>Theme: {dt.theme?.name ?? 'N/A'}</p>
            </Card>
          </Col>
        ))}
        <Card title="Add New Donation"bordered={false} style={{ width: 300, marginTop: 16 ,marginLeft:"16px", backgroundColor:"#d4d4d4"}}>
          <a href="/add" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <PlusCircleOutlined style={{ fontSize: 106 }} />
          </a>
        </Card>
      </Row>
    </div>
  );
}
