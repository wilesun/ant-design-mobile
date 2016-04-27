---
order: 1
title: 讨嫌的小红点
---

只有个讨嫌的小红点，没有具体数字

---

````jsx
import { Badge } from 'antm';

ReactDOM.render(
  <div className="badge-container">
    <Badge dot>
      <a href="#">一个链接</a>
    </Badge>

    <Badge dot size="large">
      <a href="#" className="head-example"></a>
    </Badge>
  </div>
, mountNode);
````