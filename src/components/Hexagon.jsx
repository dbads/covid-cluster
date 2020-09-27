/* eslint-disable no-console */
import React, { Component } from "react";
import "./canvas.scss";
import { Form, Input, Row, Button } from "antd";

class Hexagon extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.hexagonToAdd = React.createRef();
    this.hexagonToRemove = React.createRef();
    this.xCordinate = React.createRef();
    this.yCordinate = React.createRef();
    this.state = {
      hexSize: 20,
      hexagons: {},
    };
  }

  componentDidMount() {
    console.log("Current Hexagons", this.state.hexagons);
    this.drawHex({ x: 200, y: 100 });
  }

  componentDidUpdate() {
    console.log("Current Hexagons after Update", this.state.hexagons);
    this.drawCluster();
  }

  getActionInputs = () => {
    // const startX = Number(this.xCordinate.current.input.value);
    // const startY = Number(this.yCordinate.current.input.value);
    const hexagonToAdd = this.hexagonToAdd.current.input.value;
    const hexagonToRemove = this.hexagonToRemove.current.input.value;
    // let center;
    // if (startX && startY) {
    const center = { x: 200, y: 100 };
    // }
    return { center, hexagonToAdd, hexagonToRemove, canvas: this.canvasRef.current };
  };

  /**
   * @param {{x: Number, Y: Number}}} center cordinates of center
   * @param {Number} corner number <0-5>
   */
  getHexCornerCord = (center, corner) => {
    const { hexSize } = this.state;
    const angleDegree = 60 * corner + 30;
    const angleRadian = (Math.PI / 180) * angleDegree;
    const x = center.x + hexSize * Math.cos(angleRadian);
    const y = center.y + hexSize * Math.sin(angleRadian);
    return { x, y };
  };

  drawHex = (center) => {
    console.log("Drawing Hexagon at center", center);
    for (let i = 0; i < 6; i += 1) {
      const startCord = this.getHexCornerCord(center, i);
      const endCord = this.getHexCornerCord(center, i + 1);

      this.drawLine(startCord, endCord);
    }
  };

  drawLine = (startCord, endCord) => {
    console.log(
      "Drawing Line from ",
      startCord,
      " to ",
      endCord,
      "canvas -",
      this.canvasRef.current
    );
    const context = this.canvasRef.current.getContext("2d");
    context.beginPath();
    context.color = "red";
    context.moveTo(startCord.x, startCord.y);
    context.lineTo(endCord.x, endCord.y);
    context.stroke();
    context.closePath();
  };

  addHex = () => {
    const { center, hexagonToAdd } = this.getActionInputs();
    console.log("Hexagon to Add - ", center, hexagonToAdd);

    if (center && hexagonToAdd) {
      if (!this.state.hexagons[hexagonToAdd]) {
        const newHexagon = { [hexagonToAdd]: { center } };
        this.setState((state) => ({ hexagons: { ...state.hexagons, ...newHexagon } }));
      }
      else {
        console.log("Hexagon already added");
      }
    }
    else {
      console.log("Details are required");
    }
  };

  drawCluster = () => {
    Object.entries(this.state.hexagons).map((hexagon) => this.drawHex(hexagon[1].center));
  };

  onChange = () => {
    console.log("canvas changed");
  };

  render() {
    return (
      <div className="cluster">
        <span style={{ color: "green" }}>Hexagon Village</span>
        <br />
        <br />
        <canvas ref={this.canvasRef} />

        <Form layout="vertical">
          <Row key="addHexagonInputs">
            <Input placeholder="Name of hexagon" ref={this.hexagonToAdd} />
            <Input name="statX" placeholder="X coordinate" ref={this.xCordinate} />
            <Input name="startY" placeholder="Y coordinate" ref={this.yCordinate} />
            <Button onClick={this.addHex}>Add Hexagon</Button>
          </Row>
          <Row key="removeHexagonInputs">
            <Input placeholder="Name of hexagon" ref={this.hexagonToRemove} />
            <Button onClick={this.removeHex}>Remove Hexagon</Button>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Hexagon;
