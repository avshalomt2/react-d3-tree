import React, { PropTypes } from 'react';
import { svg, select } from 'd3';

import './style.css';

export default class Link extends React.PureComponent {

  constructor(props) {
    super(props);
    this.generatePathDescription = this.generatePathDescription.bind(this);
  }

  componentDidMount() {
    select(this.link)
    .transition()
    .duration(500)
    .attr('d', this.generatePathDescription());
  }

  componentWillLeave() {
    const { orientation, linkData } = this.props;
    const o = { x: linkData.source.x, y: linkData.source.y };
    console.log(linkData);
    select(this.link)
    .transition()
    .duration(500)
    .attr('d', this.diagonalPath({ source: o, target: o }, orientation));
  }

  diagonalPath(linkData, orientation) {
    const diagonal = svg.diagonal().projection((d) =>
      orientation === 'horizontal' ? [d.y, d.x] : [d.x, d.y]
    );
    return diagonal(linkData);
  }

  elbowPath(d, orientation) {
    return orientation === 'horizontal' ?
      `M${d.source.y},${d.source.x}V${d.target.x}H${d.target.y}` :
      `M${d.source.x},${d.source.y}V${d.target.y}H${d.target.x}`;
  }

  generatePathDescription() {
    const { linkData, orientation, pathFunc } = this.props;
    return pathFunc === 'diagonal'
      ? this.diagonalPath(linkData, orientation)
      : this.elbowPath(linkData, orientation);
  }

  render() {
    return (
      <path
        ref={(l) => { this.link = l; }}
        className="linkBase"
        d={this.generatePathDescription()}
      />
    );
  }
}

Link.propTypes = {
  linkData: PropTypes.object.isRequired,
  orientation: PropTypes.oneOf([
    'horizontal',
    'vertical',
  ]).isRequired,
  pathFunc: PropTypes.oneOf([
    'diagonal',
    'elbow',
  ]).isRequired,
};
