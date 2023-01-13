import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Table,
  Popconfirm,
  message,
} from "antd";
import { useEffect, useState } from "react";

message.config({
  duration: 1,
  maxCount: 3,
});

function App() {
  const [form] = Form.useForm(),
    [open, setOpen] = useState(false),
    { RangePicker } = DatePicker,
    { TextArea } = Input,
    { Option } = Select;

  const [title, setTitle] = useState(""),
    [type, setType] = useState(""),
    [startDate, setStartDate] = useState(""),
    [endDate, setEndDate] = useState(""),
    [description, setDescription] = useState(""),
    [data, setData] = useState([]),
    [editingKey, setEditingKey] = useState("");

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => {
        if (record.id === editingKey) {
          return (
            <Input
              style={{
                width: "100%",
              }}
              value={title}
              placeholder={text}
              onChange={(e) => setTitle(e.target.value)}
            />
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record) => {
        if (record.id === editingKey) {
          return (
            <Select
              style={{
                width: "100%",
              }}
              value={type}
              placeholder={text}
              onChange={(e) => setType(e)}
              options={[
                {
                  value: "generic",
                  label: "Generic",
                },
                {
                  value: "holiday",
                  label: "Holiday",
                },
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "Yiminghe",
                  label: "yiminghe",
                },
              ]}
            />
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      defaultSortOrder: "ascend",
      sorter: (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate),
      key: "startDate",
      render: (text, record) => {
        if (record.id === editingKey) {
          return (
            <DatePicker
              style={{
                width: "100%",
              }}
              placeholder={text}
              onChange={(e) => setStartDate(e.format("YYYY-MM-DD"))}
            />
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      defaultSortOrder: "ascend",
      sorter: (a, b) => Date.parse(a.endDate) - Date.parse(b.endDate),
      key: "endDate",
      render: (text, record) => {
        if (record.id === editingKey) {
          return (
            <DatePicker
              style={{
                width: "100%",
              }}
              placeholder={text}
              onChange={(e) => setEndDate(e.format("YYYY-MM-DD"))}
            />
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => {
        if (record.id === editingKey) {
          return (
            <TextArea
              style={{
                width: "100%",
              }}
              rows={1}
              value={description}
              placeholder={text}
              onChange={(e) => setDescription(e.target.value)}
            />
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Action",
      key: "id",
      render: (record) => {
        if (record.id === editingKey) {
          return (
            <Space
              style={{
                cursor: "pointer",
                color: "blue",
              }}
              size="middle"
            >
              <p onClick={() => setEditingKey("")}>Cancel</p>
              <Popconfirm
                title="Are you Sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleUpdate}
              >
                <p>Update</p>
              </Popconfirm>
            </Space>
          );
        } else {
          return (
            <Space
              style={{
                cursor: "pointer",
                color: "blue",
              }}
              size="middle"
            >
              <p onClick={() => setEditingKey(record.id)}>Edit</p>
              <Popconfirm
                title="Are you Sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDelete(record.id)}
              >
                <p>Delete</p>
              </Popconfirm>
            </Space>
          );
        }
      },
    },
  ];

  // fetch data on reload
  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => message.error(err));
  }, []);

  // create event
  const handleCreate = (values) => {
    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: values.title,
        type: values.type,
        startDate: values.date[0].format("YYYY-MM-DD"),
        endDate: values.date[1].format("YYYY-MM-DD"),
        description: values.description,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          setOpen(false);
          form.resetFields();
          setTimeout(() => {
            message.success("Event Added Successfully");
            setTimeout(() => {
              window.location.reload();
            }, 800);
          }, 500);
        }
      })
      .catch((err) => message.error(err));
  };

  // delete an event
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        message.success("Event Deleted Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => message.error(err));
  };

  const handleUpdate = () => {
    let rawinEditMode = {};
    if (title !== "") rawinEditMode.title = title;
    if (type !== "") rawinEditMode.type = type;
    if (startDate !== "") rawinEditMode.startDate = startDate;
    if (endDate !== "") rawinEditMode.endDate = endDate;
    if (description !== "") rawinEditMode.description = description;

    fetch(`http://localhost:3000/events/${editingKey}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...rawinEditMode }),
    })
      .then((res) => {
        if (res.status === 200) {
          setEditingKey("");
          setTimeout(() => {
            message.success("Event Updated Successfully");
            setTimeout(() => {
              window.location.reload();
            }, 800);
          }, 500);
        }
      })
      .catch((err) => message.error(err));
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space
        direction="horizontal"
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search for an event title or description"
          onChange={(e) => {
            fetch("http://localhost:3000/events")
              .then((res) => res.json())
              .then((data) => {
                const finalData = data.filter((item) => {
                  if (
                    item.title
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase()) ||
                    item.description
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  )
                    return item;
                });
                setData(finalData);
              })
              .catch((err) => message.error(err));
          }}
          style={{
            width: "350px",
          }}
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          Create Event
        </Button>
      </Space>
      <Modal
        data-testid="modal"
        open={open}
        title="Create Event"
        okText="Create"
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          data-testid="create-form"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: "Required field",
              },
            ]}
          >
            <Input placeholder="Add a title here" data-testid="title" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: "Required field",
              },
            ]}
          >
            <Select
              data-testid="type"
              showSearch={true}
              placeholder="Select a type"
            >
              <Option value="generic">Generic</Option>
              <Option value="holiday">Holiday</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[
              {
                required: true,
                message: "Required field",
              },
            ]}
          >
            <RangePicker
              data-testid="date"
              style={{
                width: "100%",
              }}
              placeholder={["Start date", "End date"]}
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea
              rows={4}
              placeholder="Add description here"
              data-testid="description"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        data-testid="ant-table"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Space>
  );
}

export default App;
