import React,{ useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, InputNumber } from 'antd';

interface Location {
    id: string;
    name: string;
    // Add other properties as needed
  }
  
  interface Status {
    id: string;
    name: string;
    // Add other properties as needed
  }
  
  interface Theme {
    id: string;
    name: string;
    // Add other properties as needed
  }
export default function Add() {
    const [Locations, setLocations] = useState<Location[]>([]);
    const [Statuses, setStatuses] = useState<Status[]>([]);
    const [Themes, setThemes] = useState<Theme[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const locationsRes = await fetch(`https://n3o-coding-task-react.azurewebsites.net/api/v1/donationItems/locations`);
            const locationsData = await locationsRes.json();
            setLocations(locationsData);
    
            const statusesRes = await fetch(`https://n3o-coding-task-react.azurewebsites.net/api/v1/donationItems/statuses`);
            const statusesData = await statusesRes.json();
            setStatuses(statusesData);
    
            const themesRes = await fetch(`https://n3o-coding-task-react.azurewebsites.net/api/v1/donationItems/themes`);
            const themesData = await themesRes.json();
            setThemes(themesData);
    
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    const onFinish = async (values: any) => {
        console.log('Form values:', values);
        try {
          const response = await fetch('https://n3o-coding-task-react.azurewebsites.net/api/v1/donationItems', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: values.name,
              location: values.location,
              theme: values.theme,
              price: {
                currencyCode: values.currency,
                amount: values.amount,
              },
            }),
          });
    
          if (response.ok) {
            console.log('Data successfully submitted');
            form.resetFields();
            navigate('/');
          } else {
            console.error('Error submitting data:', response.statusText);
          }
        } catch (error) {
          console.error('Error submitting data:', error);
        }
      };
      const [form] = Form.useForm();
  return (
    <div>
         <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <h1 style={{paddingLeft:"80px"}}>Add New Donation</h1>
            <Form.Item
            label="Name"
            name="name"
            rules={[
                { required: true, message: 'A descriptive name of the donation item is required' },
                { min: 1, message: 'Name must be at least 1 character long' },
                { max: 200, message: 'Name cannot exceed 200 characters' }
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Location"
            name="location"
            rules={[
                { required: true, message: 'The id of the location where this donation will be spent is required' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                      const validLocation = Locations.find(loc => loc.id === value);
                      if (validLocation) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Invalid location'));
                    },
                  }),
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Theme"
            name="theme"
            rules={[
                { required: true, message: 'The id of the theme towards which this donation will be spent is required' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                      const validtheme = Themes.find(th => th.id === value);
                      if (validtheme) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Invalid Theme'));
                    },
                  }),
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item label="Price" style={{ marginBottom: 0 }}>
                <Form.Item
                    name="currency"
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    rules={[
                        { pattern: /^GBP$/, message: 'Currency must be GBP' },
                      ]}
                >
                    <Input placeholder="Input currency" />
                </Form.Item>
                <Form.Item
                    name="amount"
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                    rules={[
                        {
                            validator: (_, value) => {
                              const parsedValue = parseInt(value);
                              if (isNaN(parsedValue)) {
                                return Promise.reject(new Error('Amount must be a number'));
                              }
                              if (parsedValue <= 0) {
                                return Promise.reject(new Error('Amount must be greater than 0'));
                              }
                              return Promise.resolve();
                            },
                          },
                      ]}
                >
                    <Input placeholder="Enter amount" />
                </Form.Item>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Add
            </Button>
            </Form.Item>
        </Form>
    </div>
  )
}
