import './App.css'

import React, { Component } from 'react';
import Board from 'react-trello';
// import CustomCard from './CustomCard'
import CardBase from './CardBase'
const data = require('./exception-data.json');

// const Customdata = {
//   lanes: [
//     {
//       id: 'lane1',
//       title: 'Planned Tasks',
//       label: '12/12',
//       style: {backgroundColor: 'cyan', padding: 20},
//       titleStyle: {fontSize: 20, marginBottom: 15},
//       labelStyle: {color: '#009688', fontWeight: 'bold'},
//       cards: [
//         {
//           id: 'Card1',
//           name: 'John Smith',
//           dueOn: 'due in a day',
//           subTitle: 'SMS received at 12:13pm today',
//           body: 'Thanks. Please schedule me for an estimate on Monday.',
//           escalationText: 'Escalated to OPS-ESCALATIONS!',
//           cardColor: '#BD3B36',
//           cardStyle: {borderRadius: 6, boxShadow: '0 0 6px 1px #BD3B36', marginBottom: 15},
//           metadata: {id: 'Card1'}
//         },
//         {
//           id: 'Card2',
//           name: 'Card Weathers',
//           dueOn: 'due now',
//           subTitle: 'Email received at 1:14pm',
//           body: 'Is the estimate free, and can someone call me soon?',
//           escalationText: 'Escalated to Admin',
//           cardColor: '#E08521',
//           cardStyle: {borderRadius: 6, boxShadow: '0 0 6px 1px #E08521', marginBottom: 15},
//           metadata: {id: 'Card1'}
//         }
//       ]
//     },
//     {
//       id: 'lane2',
//       title: 'Long Lane name this is i suppose ha!',
//       cards: [
//         {
//           id: 'Card3',
//           name: 'Michael Caine',
//           dueOn: 'due in a day',
//           subTitle: 'Email received at 4:23pm today',
//           body: 'You are welcome. Interested in doing business with you again',
//           escalationText: 'Escalated to OPS-ESCALATIONS!',
//           cardColor: '#BD3B36',
//           cardStyle: {borderRadius: 6, boxShadow: '0 0 6px 1px #BD3B36', marginBottom: 15},
//           metadata: {id: 'Card1'},
//           tags: [{title: 'Critical', color: 'white', bgcolor: 'red'}, {title: '2d ETA', color: 'white', bgcolor: '#0079BF'}]
//         }
//       ]
//     }
//   ]
// }

const handleDragStart = (cardId, laneId) => {
  console.log('drag started')
  console.log(`cardId: ${cardId}`)
  console.log(`laneId: ${laneId}`)
}

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log('drag ended')
  console.log(`cardId: ${cardId}`)
  console.log(`sourceLaneId: ${sourceLaneId}`)
  console.log(`targetLaneId: ${targetLaneId}`)
}

class App extends Component {
  state = { boardData: { lanes: [] } }

  setEventBus = (eventBus) => {
    this.setState({ eventBus })
  }

  async componentWillMount() {
    const response = await this.getBoard()
    this.setState({ boardData: response })
  }

  getBoard() {
    return new Promise((resolve) => {
      resolve(data)
    })
  }

  completeCard = () => {
    this.state.eventBus.publish({
      type: 'ADD_CARD',
      laneId: 'COMPLETED',
      card: {
        id: 'Milk',
        title: 'Buy Milk',
        label: '15 mins',
        description: 'Use Headspace app',
      },
    })
    this.state.eventBus.publish({
      type: 'REMOVE_CARD',
      laneId: 'PLANNED',
      cardId: 'Milk',
    })
  }

  addCard = () => {
    this.state.eventBus.publish({
      type: 'ADD_CARD',
      laneId: 'BLOCKED',
      card: {
        id: 'Ec2Error',
        title: 'EC2 Instance Down',
        label: '30 mins',
        description: 'Main EC2 instance down',
      },
    })
  }

  shouldReceiveNewData = (nextData) => {
    console.log('New card has been added')
    console.log(nextData)
  }

  handleCardAdd = (card, laneId) => {
    console.log(`New card added to lane ${laneId}`)
    console.dir(card)
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h3>React Trello Demo</h3>
        </div>
        <div className="App-intro">
          <button onClick={this.completeCard} style={{ margin: 5 }}>
            Complete Buy Milk
          </button>
          <button onClick={this.addCard} style={{ margin: 5 }}>
            Add Blocked
          </button>
          <Board
            editable
            onCardAdd={this.handleCardAdd}
            data={this.state.boardData}
            draggable
            onDataChange={this.shouldReceiveNewData}
            eventBusHandle={this.setEventBus}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}     
            components={{Card: CardBase}}      
          />
        </div>
      </div>
    )
  }
}

export default App
