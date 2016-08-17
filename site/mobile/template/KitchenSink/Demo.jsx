import React from 'react';
import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import classNames from 'classnames';
import * as utils from '../../../theme/template/utils';
import { Link } from 'react-router';
import { Drawer, List, Icon } from 'antd-mobile';

export function collect(nextProps, callback) {
  const componentsList = utils.collectDocs(nextProps.data.components);

  const moduleDocs = [
    ...utils.collectDocs(nextProps.data.docs.react),
    ...componentsList,
    /* eslint-disable new-cap */
    nextProps.data.CHANGELOG(),
    /* eslint-enable new-cap */
  ];

  // const componentName = nextProps.params.component;
  const componentName = nextProps.params.component;
  const demos = nextProps.utils.get(nextProps.data, ['components', componentName, 'demo']);

  const promises = [Promise.all(componentsList), Promise.all(moduleDocs)];

  if (demos) {
    promises.push(Promise.all(
      Object.keys(demos).map((key) => {
        if (typeof demos[key] === 'function') {
          return demos[key]();
        /* eslint-disable no-else-return */
        } else {
          return demos[key].web();
        }
      })
    ));
  }

  Promise.all(promises)
    .then((list) => callback(null, {
      ...nextProps,
      components: list[0],
      moduleData: list[1],
      demos: list[2],
    }));
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: this.getCurrent(props.params.index) || 0,
      customNavBar: null,
      open: false,
      position: 'left',
    };
  }

  componentWillReceiveProps = () => {
    this.setState({
      open: false,
    });
  }

  getCurrent = (name) => {
    const demoSort = this.props.demos.sort((a, b) => (
      parseInt(a.meta.order, 10) - parseInt(b.meta.order, 10)
    ));

    let currentIndex;
    demoSort.forEach((i, index) => {
      const fileArr = i.meta.filename.split('/');
      const filename = fileArr[fileArr.length - 1].split('.')[0];
      if (filename === name) {
        currentIndex = index;
      }
    });

    return currentIndex;
  }

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { demos } = this.props;
    const { current } = this.state;
    const name = this.props.params.component;

    const demoSort = demos.sort((a, b) => (
      parseInt(a.meta.order, 10) - parseInt(b.meta.order, 10)
    ));

    demoSort[current].preview.call(this);
    const customNavFlag = this.customNavFlag;

    const lists = {};
    this.props.components.forEach(i => {
      const meta = i.meta;
      if (!lists[meta.category]) {
        lists[meta.category] = [];
      }
      lists[meta.category].push(meta);
    });

    const componentList = lists.APIS.concat(lists.Components);

    let demoMeta;
    componentList.forEach((item) => {
      if (item.filename.split('/')[1] === name) {
        demoMeta = item;
      }
    });

    const sidebar = (<div>
      <div className="demo-drawer-home">
        <Link to="/">Ant Design Mobile</Link>
      </div>
      {Object.keys(lists).map((cate, index) => (
        <List key={index} title={cate}>
          <List.Body>
            {
              lists[cate].map((item, ii) => {
                const fileName = item.filename.split('/')[1];
                return (<List.Item key={ii}>
                  <Link to={`/${fileName}/`}>{item.chinese}</Link>
                </List.Item>);
              })
            }
          </List.Body>
        </List>
      ))}
    </div>);

    const drawerProps = {
      open: this.state.open,
      position: this.state.position,
      onOpenChange: this.onOpenChange,
    };

    return (
      <div id={name}>
        <div className="demo-drawer-trigger">
          <span onClick={this.onOpenChange}><Icon type="bars" /></span>
        </div>
        <div className="demo-drawer-container">
          <Drawer sidebar={sidebar} dragHandleStyle={{ display: 'none' }} {...drawerProps}>
            <div className="demoName">
              {demoMeta.chinese}
              <p>{demoMeta.english}</p>
            </div>

            {
            demoSort.length > 1 &&
              <div className="demoLinks">
                <ul>
                  {
                    demoSort.map((item, index) => (
                      <li key={index}>
                        <a href={`${window.location.protocol}//${window.location.host}/kitchen-sink/${name}/#${name}-demo-${index}`}>{item.meta.title}</a>
                      </li>
                    ))
                  }
                </ul>
              </div>
            }

            {demoSort.map((i, index) => {
              let isShow = current - index === 0;
              // ListView 组件要占用全屏、不能多实例共存（用 destroyComponent 做标记）
              if (i.meta.destroyComponent && window.name !== 'demoFrame') {
                isShow = this.props.params.index === undefined && current === index;
              }

              const previewItemClass = classNames({
                'demo-preview-item': true,
                'demo-preview-item-custom': !!customNavFlag,
                show: true,
                hide: true,
              });

              return (
                <div className={previewItemClass} id={`${name}-demo-${index}`} key={index}>
                  <div className="demoTitle">{i.meta.title}</div>
                  {!i.meta.destroyComponent || isShow ? i.preview(React, ReactDOM) : null}
                  {!!i.style ? <style dangerouslySetInnerHTML={{ __html: i.style }} /> : null}
                </div>
              );
            })}
          </Drawer>
        </div>
      </div>
    );
  }
}
