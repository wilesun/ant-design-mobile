---
order: 0
title: 基本
---

日期时间选择示例

[rc-form API](https://github.com/react-component/form)

````jsx

import { DatePicker, List } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import enUs from 'antd-mobile/components/date-picker/locale/en_US';

const now = moment().utcOffset(0);

let Test = React.createClass({
  render() {
    const { getFieldProps } = this.props.form;
    return (<div>
      <List style={{ backgroundColor: 'white' }}>
        <List.Header>选择时间</List.Header>
        <List.Body>
          <DatePicker
            className="am-date-picker"
            mode="date"
            title="选择日期"
            extra="可选,小于结束日期"
            {...getFieldProps('date1', {
              initialValue: (this.date1 || (this.date1 = moment('2015-08-06', 'YYYY-MM-DD'))),
            })}
            minDate={this.date1MinDate || (this.date1MinDate = moment('2015-08-06', 'YYYY-MM-DD'))}
            maxDate={this.date1MaxDate || (this.date1MaxDate = moment('2016-12-03', 'YYYY-MM-DD'))}
          >
            <List.Item arrow="horizontal">日期</List.Item>
          </DatePicker>
          <DatePicker mode="time" {...getFieldProps('time1')}>
            <List.Item arrow="horizontal">时间,不限定上下限</List.Item>
          </DatePicker>
          <DatePicker mode="time" {...getFieldProps('time')}
            minDate={this.timeMinDate || (this.timeMinDate = moment('00:30', 'HH:mm'))}
            maxDate={this.timeMaxDate || (this.timeMaxDate = moment('22:00', 'HH:mm'))}
          >
            <List.Item arrow="horizontal">时间</List.Item>
          </DatePicker>
          <DatePicker
            mode="datetime"
            {...getFieldProps('datetime')}
          >
            <List.Item arrow="horizontal">日期+时间</List.Item>
          </DatePicker>
          <DatePicker
            mode="datetime"
            format={val => val.format('YYYY-MM-DD + HH:mm')}
            okText="Ok"
            dismissText="Cancel"
            locale={enUs}
            {...getFieldProps('customformat', {
              initialValue: now,
            })}
          >
            <List.Item arrow="horizontal">datetime(en_US)</List.Item>
          </DatePicker>
        </List.Body>
      </List>
    </div>);
  },
});

Test = createForm()(Test);

ReactDOM.render(<Test />, mountNode);
````
