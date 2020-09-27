import React, { Component } from "react";
import { Line } from "draw-shape-reactjs";
import { Form, Input, Row, Button } from "antd";

class HexagonCluster extends Component {
  constructor(props) {
    super(props);
    this.hexagonToAdd = React.createRef();
    this.hexagonToRemove = React.createRef();
    this.xCordinate = React.createRef();
    this.yCordinate = React.createRef();
    this.state = {
      hexagons: {},
    };
  }

  componentDidMount() {
    console.log("--current hexagon--", this.state.hexagons);
    // Object.entries(this.state.hexagons).map((hexagon) => console.log(hexagon[0], hexagon[1], "---hexagon --"));
  }

  componentDidUpdate() {
    console.log("--current hexagon after update--", this.state.hexagons);
    // Object.entries(this.state.hexagons).map((hexagon) =>
    //   console.log(hexagon[0], hexagon[1], "---hexagon --")
    // );
  }

  createHexagon = (hexagonBorders, hexagonName) => {
    // console.log("creating new hexagon ---", hexagonBorders, hexagonName);
    return (
      <div key={hexagonName}>
        {hexagonBorders?.map((border, index) => {
          // console.log(border, index, "---border-- index");
          return (
            <Line
              key={`${hexagonName}-${index}`}
              position="fixed"
              from={border.from}
              to={border.to}
              color={border.colour}
            />
          );
        })}
      </div>
    );
  };

  getActionInputs = () => {
    const startX = Number(this.xCordinate.current.input.value);
    const startY = Number(this.yCordinate.current.input.value);
    const hexagonToAdd = this.hexagonToAdd.current.input.value;
    const hexagonToRemove = this.hexagonToRemove.current.input.value;

    return { startX, startY, hexagonToAdd, hexagonToRemove };
  };

  resetInputs = () => {
    this.xCordinate.current.input.value = null;
    this.yCordinate.current.input.value = null;
    this.hexagonToAdd.current.input.value = null;
    this.hexagonToRemove.current.input.value = null;
  };

  addHexagon = () => {
    const { startX, startY, hexagonToAdd } = this.getActionInputs();
    // this.resetInputs();
    // console.log(startX, startY, hexagonToAdd, "----- hexagon details --");

    if (startX && startY && hexagonToAdd) {
      if (!this.state.hexagons[hexagonToAdd]) {
        const height = (3 ** (1 / 2) / 2) * 50;
        const borders = [
          { from: [startX, startY], to: [startX + 25, startY - height], colour: "green" },
          {
            from: [startX + 25, startY - height],
            to: [startX + 75, startY - height],
            colour: "red",
          },
          { from: [startX + 75, startY - height], to: [startX + 100, startY], colour: "blue" },
          { from: [startX + 100, startY], to: [startX + 75, startY + height], colour: "pink" },
          {
            from: [startX + 75, startY + height],
            to: [startX + 25, startY + height],
            colour: "brown",
          },
          { from: [startX + 25, startY + height], to: [startX, startY], colour: "violet" },
        ];
        // console.log("-- updating cluster --");
        const newHexagon = { [hexagonToAdd]: borders };
        this.setState((state) => ({ hexagons: { ...state.hexagons, ...newHexagon } }));
        // console.log("-- updated cluster --", this.state.hexagons);
      } else {
        console.log("--hexagon already added ---");
      }
    } else {
      console.log("--hexagon details are required ---");
    }
  };

  removeHexagon = () => {
    const { hexagonToRemove } = this.getActionInputs();
    // this.resetInputs();
    console.log("-- removing hexagon --", hexagonToRemove);
    if (hexagonToRemove) {
      if (this.state.hexagons[hexagonToRemove]) {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const { hexagons } = this.state;
        delete hexagons[hexagonToRemove];
        console.log("newHexagons after removing --", hexagons);
        this.setState({ hexagons });
      } else {
        console.log("-- hexagon already removed --");
      }
    } else {
      console.log("--hexagon details are required ---");
    }
  };

  createCluster() {
    return (
      <div key="villageCluster">
        {Object.entries(this.state.hexagons)?.map((hexagon) =>
          this.createHexagon(hexagon[1], hexagon[0])
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="hexagonCluster">
        <span style={{ color: "blue" }}> Add/Remove Hexagons </span>
        {this.createCluster()}

        <Form layout="vertical">
          <Row key="addHexagonInputs">
            <Input placeholder="Name of hexagon" ref={this.hexagonToAdd} />
            <Input name="statX" placeholder="X coordinate" ref={this.xCordinate} />
            <Input name="startY" placeholder="Y coordinate" ref={this.yCordinate} />
            <Button onClick={this.addHexagon}>Add Hexagon</Button>
          </Row>
          <Row key="removeHexagonInputs">
            <Input placeholder="Name of hexagon" ref={this.hexagonToRemove} />
            <Button onClick={this.removeHexagon}>Remove Hexagon</Button>
          </Row>
        </Form>
      </div>
    );
  }
}

export default HexagonCluster;

/* <Line key="0" position="fixed" from={[100, 100]} to={[150, 100]} color="green" />
<Line key="1" position="fixed" from={[150, 100]} to={[200, 150]} color="red" />
<Line key="2" position="fixed" from={[200, 150]} to={[150, 200]} color="yellow" />
<Line key="3" position="fixed" from={[150, 200]} to={[100, 200]} color="pink" />
<Line key="4" position="fixed" from={[100, 200]} to={[50, 150]} color="blue" />
<Line key="5" position="fixed" from={[50, 150]} to={[100, 100]} color="violet" /> */
