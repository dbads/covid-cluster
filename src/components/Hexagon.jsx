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
    this.sideNoRef = React.createRef();
    this.colours = { 0: "red", 1: "green", 2: "brown", 3: "blue", 4: "purple", 5: "pink" };
    this.sides = new Map();
    this.state = {
      hexSize: 15,
      hexagons: {},
      // hexagons: { a: { center: { x: 50, y: 50 } }, b: { center: { x: 10, y: 10 } } },
    };
    /* hexagons format
    {
      [hexName] : {
        center: { x: 50, y: 50}, // center coordinate
        sides: {
          0: {
            start: { x: 100, y: 100},
            end: { x: 150, y: 150}
          },
          // ..... all sides similarly
        }
      }
    }
    */
  }

  componentDidMount() {
    console.log("Current Hexagons", this.state.hexagons);
    this.drawHex();
    // this.drawCluster();
  }

  componentDidUpdate() {
    console.log("Current Hexagons after Update", this.state.hexagons);
    this.drawCluster();
  }

  getCenter = (start, end, existingHexCenter = undefined) => {
    return { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  };

  getActionInputs = () => {
    const sideNo = this.sideNoRef.current.input.value;
    const hexagonToAdd = this.hexagonToAdd.current.input.value;
    const hexagonToRemove = this.hexagonToRemove.current.input.value;
    let center = { x: 100, y: 100 };
    if (sideNo) {
      const { start, end } = this.state.hexagons[hexagonToAdd].sides[sideNo];
      center = this.getCenter(start, end);
    }

    return { sideNo, center, hexagonToAdd, hexagonToRemove, canvas: this.canvasRef.current };
  };

  /**
   * @param {{x: Number, Y: Number}}} center cordinates of center
   * @param {Number} corner number <0-5>
   */
  getHexCornerCord = (center, corner) => {
    const { hexSize } = this.state;
    const angleDegree = 60 * corner + 60;
    const angleRadian = (Math.PI / 180) * angleDegree;
    const x = center.x + hexSize * Math.cos(angleRadian);
    const y = center.y + hexSize * Math.sin(angleRadian);
    return { x, y };
  };

  getHexSide = (center) => {
    const sides = {};
    for (let i = 0; i < 6; i += 1) {
      const startCord = this.getHexCornerCord(center, i);
      const endCord = this.getHexCornerCord(center, i + 1);
      sides[i] = { startCord, endCord };
    }
    console.log(sides, "sides");
    return sides;
  };

  drawHex = (hexName, center = { x: 100, y: 100 }) => {
    // console.log("Drawing Hexagon at center", center);
    let sides;
    if (hexName) sides = this.state.hexagons[hexName].sides;
    else {
      sides = this.getHexSide(center);
    }
    Object.entries(sides).map((side) => {
      console.log(side, "side-");
      return this.drawLine(side[1].startCord, side[1].endCord, Number(side[0]));
    });
  };

  drawLine = (startCord, endCord, sideNo) => {
    console.log(
      "Drawing Line from ",
      startCord,
      " to ",
      endCord,
      "canvas -",
      this.canvasRef.current
    );
    const lineMid = { x: (startCord.x + endCord.x) / 2, y: (startCord.y + endCord.y) / 2 };
    // const color = this.colours[sideNo];
    const context = this.canvasRef.current.getContext("2d");
    // context.translate(0.5, 0.5);
    context.beginPath();
    // context.strokeStyle = color;
    context.moveTo(startCord.x, startCord.y);
    context.lineTo(endCord.x, endCord.y);
    context.font = "5px Verdana";
    context.strokeText(sideNo, lineMid.x + 1, lineMid.y + 1);
    // context.translate(-0.5, -0.5);
    context.stroke();
    context.closePath();
  };

  addHex = (center, sides) => {
    const { hexagonToAdd, sideNo } = this.getActionInputs();
    console.log("Hexagon to Add - ", hexagonToAdd, sideNo);

    if (hexagonToAdd && sideNo) {
      if (!this.state.hexagons[hexagonToAdd]) {
        const existingHex = this.state.hexagons[hexagonToAdd];
        const { start, end } = existingHex.sides[sideNo];
        const existingHexCenter = existingHex.center;
        center = this.getCenter(start, end, existingHexCenter);

        const newHexagonSides = this.getHexSide(center);
        const newHexagon = { [hexagonToAdd]: { center }, ...newHexagonSides };
        this.setState((state) => ({ hexagons: { ...state.hexagons, ...newHexagon } }));
      } else {
        console.log("Hexagon already added");
      }
    } else if (center && sides) {
      // when adding first cluster, added during mounting, initial hexagon
      const newHexagon = { a: { center }, ...sides };
      this.setState((state) => ({ hexagons: { ...state.hexagons, ...newHexagon } }));
    } else {
      console.log("Details are required");
    }
  };

  drawCluster = () => {
    Object.entries(this.state.hexagons).map((hexagon) => this.drawHex(hexagon[1].center));
  };

  render() {
    return (
      <div className="cluster">
        <span style={{ color: "green" }}>Hexagon Village(Draft...)</span>

        <a href="https://github.com/dbads/covid-cluster" style={{ float: "right" }}>
          GitHub Repo
        </a>
        <br />
        <br />
        <canvas ref={this.canvasRef} />

        <Form layout="vertical">
          <Row key="addHexagonInputs">
            <Input placeholder="Name of hexagon" ref={this.hexagonToAdd} />
            <Input name="statX" placeholder="Border No" ref={this.sideNoRef} />
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
