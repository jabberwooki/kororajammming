import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderAction = this.renderAction.bind(this);
  }
  
  renderAction() {
    if (this.props.isRemoval) {
      return <span onClick={this.removeTrack}> - </span>;
    }
    else {
      return <span onClick={this.addTrack}> + </span>;
    }
  }
  
  addTrack() {
    this.props.onAdd(this.props.track);
  }
  
  removeTrack() {
    this.props.onRemove(this.props.track);
  }  
  
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artists[0].name} | {this.props.track.album.name}</p>
        </div>
        <a className="Track-action">{this.renderAction()}</a>
      </div>
    );
  }
}

export default Track;
