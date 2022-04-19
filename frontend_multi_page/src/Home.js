import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Toast from 'react-bootstrap/Toast'

import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, ResponsiveContainer, YAxis, XAxis, Tooltip, Label} from 'recharts';
import './Style.css';

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MonthView } from 'react-calendar';
import LogoutButton from './LogoutButton';
import{GoogleLogin} from "react-google-login";

import { useLocation } from 'react-router-dom';

import {fetchDataByDeviceID} from './AwsFunctions';

const locales = {
  "en-US" : require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const symptoms = [
  {
    title: "Cramps",
    start: new Date(2021, 10, 27),
    end: new Date(2021,10, 27)
  },
  {
    title: "Nausea",
    start: new Date(2021, 10, 27),
    end: new Date(2021,10, 27)
  },
  {
    title: "Irritable Mood",
    start: new Date(2021, 10, 27),
    end: new Date(2021,10, 27)
  },
  {
    title: "Cramps",
    start: new Date(2021, 10, 28),
    end: new Date(2021,10, 28)
  },
  {
    title: "Nausea",
    start: new Date(2021, 10, 28),
    end: new Date(2021,10, 28)
  },
  {
    title: "Cramps",
    start: new Date(2021, 10, 29),
    end: new Date(2021,10, 29)
  }
]

const t_day = [
  { 
    start: new Date(),
    end: new Date()
  }
]

const vol = Math.floor(Math.random()*31); 
const val = (vol/30) * 100; 


function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);



  useEffect(() => {
    const loadPost = async () => {

        // Till the data is fetch using API 
        // the Loading page will show.
        setLoading(true);

        var id_num = '3'

        if (user_name.user_name == "Megan Talbert"){ 
          id_num = '1';
        } else if (user_name.user_name == "Emma Lee"){ 
          id_num = '1'; //change when there's test data for device ID 2
        }
  

        // Await make wait until that 
        // promise settles and return its result
        let currentTimestamp = Date.now().toString();
        let startTimestamp = (currentTimestamp - 60*30*1000).toString();//update this to be the correct number of days ago!
        const response = await fetchDataByDeviceID(id_num, startTimestamp, currentTimestamp)

        // After fetching data stored it in posts state.
        setData(response);

        // console.log(data)
        // console.log(user_name.user_name);

        // Closed the loading page
        setLoading(false);
    }

    // Call the function
    loadPost();
  }, []);

  const today = new Date(); 
  const t = (today.getFullYear(), today.getMonth(), today.getDay());

  const [showData, setShowData] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(true);

  const toggleShowA = () => setShowA(!showA);
  const toggleShowB = () => setShowB(!showB);


  const [newSymptom, changeNewSymptom] = useState({title: "", 
  start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay() + 12) , 
  end: ""}) 
  const setNewSymptom = (symptom) => {
    // maintaining name to reduce refactor complexity 
    symptom.end = symptom.start; 
  
    changeNewSymptom(symptom); 

  }
  const [allSymptoms, setAllSymptoms] = useState(symptoms)

  function addSymptom(){ 
    setAllSymptoms([...allSymptoms, newSymptom])
  }
  const formats = {
    eventTimeRangeFormat: () => { 
      return "";
    },
  };

  const location = useLocation();
  const user_name = location.state; 
  // var id_num = '3'; 

  // function user_ID(){ 
  //   if ({user_name} == "Megan Talbert"){ 
  //     id_num = '1';
  //   } else if({user_name} == "Emma Lee" ){ 
  //     id_num = '2';
  //   }

  //   return id_num; 
  // }
  

  function Chart(props) {
    // const data = [
    //   {
    //     name: 'Day 1',
    //     pv: 10
    //   },
    //   {
    //     name: 'Day 2',
    //     pv: 20
    //   },
    //   {
    //     name: 'Day 3',
    //     pv: 4
    //   },
    //   {
    //     name: 'Day 4',
    //     pv: 2
    //   }
    // ]; 
    const newData = props.data.map((item) => 
    ({
      name: new Date(item.timestamp*1).toLocaleString().slice(0,4) + new Date(item.timestamp*1).toLocaleString().slice(10,-6)+new Date(item.timestamp*1).toLocaleString().slice(-2), //really sketchy way of getting time formatted correctly but it works (test with times in the double digits though)
      vol: item['flow data'].flow_sensor_a0
    })
    )
    return(
      <ResponsiveContainer>
        <LineChart data={newData} margin={{ top: 5, right: 5, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
              <Label value = "Time" offset = {0} position = "bottom" />
              </XAxis>
            <YAxis>
            <Label value = "Volume (mL)" offset = {0} position = "left" angle="-90"/>
            </YAxis>
            <Tooltip />
            <Line type="monotone" dataKey="vol" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    ) 
  }

  function Notif(props){ 
    if (val > 85){ 
      return ( 
        <Toast onClose={toggleShowB} show={showB} animation={false} style = {{marginBottom: "10px"}}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>Time to remove soon!</Toast.Body>
        </Toast>
      );
    } else { 
      return null; 
    }
  }

  return (
    <div className="App">
       {loading || (data.length <= 0) ? (
        <h4>Loading...</h4>) :
        (
        //   data.map((item) =>
        // // Presently we only fetch 
        // // title from the API 
        // <Container>
        //   <h4>Device ID: {item.deviceID}</h4>
        //   <h4>Timestamp: {item.timestamp}</h4>
        //   <h4>Flow Data: {item['flow data'].flow_sensor_a0}</h4>
        //   <h4>Accurate: {item['flow data'].stand}</h4>
        //   <br />
        // </Container>
        // )
        <Container fluid className="ContainerStyle">
        <Row className="h-100">
          <Col className="ColDashboardItem">
            <Row className="h-50 w-100"> 
              <Col>              
                <Stack direction="horizontal" gap={3}>
                  <h2>Calendar</h2>
                  <Button className="ms-auto" onClick={() => setShowCalendar(true)}>Expand</Button>
                </Stack>
                <Stack gap={3}>
                  <div>How are you feeling today?</div>
                  <input type="text" placeholder ="Add Symptom" value={newSymptom.title} onChange={(e) => setNewSymptom({...newSymptom, title: e.target.value})}/> 
                  <Button onClick={() => { 
                            setShowA(true);
                            addSymptom();
                      }} > Add Symptom </Button>
                  <Toast onClose={() => setShowA(false)} show={showA} delay={3000} autohide>
                    <Toast.Header><strong className="me-auto"> Notification </strong></Toast.Header>
                    <Toast.Body> Symptom Logged!</Toast.Body>
                  </Toast>
                </Stack>
              </Col>

              <Modal  
                show={showCalendar} 
                onHide={() => setShowCalendar(false)}
                dialogClassName="Modal" 
              >
                <Row>
                  <Col className="h-100" md={3}>
                    <Stack gap={4} className="mx-auto" margin="10px" >
                      <h1 className="mx-auto">Calendar</h1>
                      <h3 className="mx-auto">How are you feeling today?</h3>
                      <input type="text" placeholder ="Add Symptom" value={newSymptom.title} onChange={(e) => setNewSymptom({...newSymptom, title: e.target.value})}/> 
                      <DatePicker 
                        placeholderText="Start Date" 
                        style={{ marginRight: "10px" }} 
                        selected={newSymptom.start} 
                        onChange={(start) => setNewSymptom({ ...newSymptom, start })} 
                      />
                      <Button onClick={() => { 
                          setShowA(true);
                          addSymptom();
                      }}>
                        Add Symptom
                      </Button>
                    </Stack> 
                    <Toast onClose={() => setShowA(false)} show={showA} delay={3000} autohide>
                      <Toast.Header><strong className="me-auto"> Notification </strong></Toast.Header>
                      <Toast.Body> Symptom Logged!</Toast.Body>
                    </Toast>
                  </Col>
                  <Col>
                    <Calendar 
                          formats = {formats}
                          localizer={localizer} 
                          events={allSymptoms} 
                          startAccessor={"start"} 
                          endAccessor={"end"} 
                          style={{height:500, margin: "50px"}} 
                          views={['month', 'week', 'day']}
                    />  
                  </Col>
                </Row>
              </Modal>
            </Row>

            <Row className="h-50 w-100">
              <Col>
                <Stack direction="horizontal" gap={3}>
                  <h2 className= "Header" >Data</h2>
                  <Button className="ms-auto" onClick={() => setShowData(true)}>Export</Button>  
                </Stack>
              </Col>

              <div>
                <Chart data={data} />
              </div>

              <Modal 
                show={showData} 
                onHide={() => setShowData(false)}
                dialogClassName="Modal"
              >
                Test Modal
                <Chart/>
              </Modal>
            </Row>
          </Col>

          <Col className="ColDashboardItem">
            <Row>
              <div> 
               <Notif/> 
              </div>
              <h2>Current Volume: {data.reduce((prev, current) => (prev.timestap > current.timestap) ? prev['flow data'].flow_sensor_a0 : current['flow data'].flow_sensor_a0, 0)} mL </h2>
            </Row>
            <Row>
              <ProgressBar now={data.reduce((prev, current) => (prev.timestap > current.timestap) ? prev['flow data'].flow_sensor_a0 : current['flow data'].flow_sensor_a0, 0)/30 * 100} className="progressBar" variant="danger"/> 
            </Row>
            <LogoutButton/>
          </Col>
        </Row>
      </Container>
        )
      }

    </div>
  );
}

export default Home;
