import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chat.css';
import { FaMicrophone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Stationinfo from './Stationinfo';


function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [fuelStations] = useState([]);
    const [chargingStations] = useState([]);
    const [isListening, setIsListening] = useState(false);

    const Chat = ({ stations }) => {
        return (
            <div>
                {stations.map(station => (
                    <Stationinfo
                        key={station.id}
                        name={station.name}
                        address={station.address}
                        distance={station.distance}
                    />
                ))}
            </div>
        );
    };
    useEffect(() => {
        const initialMessage = {
            id: Date.now(),
            text: '안녕하세요! 여러분 주변에 최저가 주유소, 전기차 충전소 위치 등을 알려주고, 고속도로의 휴게소 정보를 알려드립니다:)',
            sender: 'bot'
        };
        setMessages([initialMessage]);
        speak(initialMessage.text);

        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, []);

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [messages]);

    const speak = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        synth.speak(utterance);
    };

    const handleSpeech = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.start();

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            console.log(`Recognized: ${speechResult}`);
            handleMessage(speechResult);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
    };

    const fetchChargingStations = async (latitude, longitude) => {
        try {
            const response = await axios.post('http://13.125.136.48:5000/location', {
                latitude: latitude,
                longitude: longitude
            });
            const formattedStations = response.data.stations.map(station => `${station['Station Name']} - 현 위치로부터 ${formatChargingStationDistance(station.Distance)} 떨어짐`).join('\n');
            const resultsMessage = {
                id: Date.now(),
                text: `전기차 충전소 정보:\n${formattedStations}`,
                sender: 'bot'
            };
            setMessages(messages => [...messages, resultsMessage]);
            speak(resultsMessage.text);
        } catch (error) {
            console.error("Error fetching stations:", error);
        }
    };

    const fetchFuelPrices = async (latitude, longitude, type) => {
        try {
            const response = await axios({
                method: 'post',
                url: 'http://13.125.136.48:5000/get_gas_stations22',
                data: { latitude, longitude, type }
            });

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data.data, "application/xml");
            const oilNodes = xmlDoc.getElementsByTagName("OIL");

            const stations = Array.from(oilNodes).map(node => ({
                id: node.getElementsByTagName("UNI_ID")[0].textContent,
                name: node.getElementsByTagName("OS_NM")[0].textContent,
                price: node.getElementsByTagName("PRICE")[0].textContent,
                distance: node.getElementsByTagName("DISTANCE")[0].textContent
            })).sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(0, 10);

            const formattedStations = stations.map(station => `${station.name} - ${station.price}원 - 현 위치로부터 ${formatFuelStationDistance(station.distance)} 떨어짐`).join('\n');
            const resultsMessage = {
                id: Date.now(),
                text: `주유소 정보:\n${formattedStations}`,
                sender: 'bot'
            };
            setMessages(messages => [...messages, resultsMessage]);
            speak(resultsMessage.text);
        } catch (error) {
            console.error("Error fetching stations:", error);
        }
    };

    const formatFuelStationDistance = (distance) => {
        const distanceInMeters = parseFloat(distance);
        return `${(distanceInMeters / 1000).toFixed(2)}km`;
    };

    const formatChargingStationDistance = (distance) => {
        const distanceInMeters = parseFloat(distance);
        return `${distanceInMeters.toFixed(2)}km`;
    };

    const handleMessage = (message) => {
        setMessages(messages => [...messages, {id: Date.now(), text: message, sender: 'user'}]);
        speak(message);

        if (message.includes('주유소')) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const {latitude, longitude} = position.coords;
                    fetchFuelPrices(latitude, longitude, 'fuel');
                }, handleGeolocationError);
            } else {
                const botResponse = {id: Date.now(), text: "Geolocation이 지원되지 않는 브라우저입니다.", sender: 'bot'};
                setMessages(messages => [...messages, botResponse]);
                speak(botResponse.text);
            }
        } else if (message.includes('전기차')) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const {latitude, longitude} = position.coords;
                    fetchChargingStations(latitude, longitude);
                }, handleGeolocationError);
            } else {
                const botResponse = {id: Date.now(), text: "Geolocation이 지원되지 않는 브라우저입니다.", sender: 'bot'};
                setMessages(messages => [...messages, botResponse]);
                speak(botResponse.text);
            }
        }
        if (message.includes('고속도로 휴게소 정보 보러가기')) {
            const RestareaUrl = "http://13.125.136.48:3000/restArea";
            const botResponse = {
                id: Date.now(),
                text: `고속도로 휴게소 정보를 확인하러 가려면 여기를 클릭하세요.`,
                sender: 'bot',
                url: RestareaUrl // URL을 메시지 객체에 추가
            };
            setMessages(messages => [...messages, botResponse]);
            speak("고속도로 휴게소 정보 페이지 링크를 보냈습니다.");
        }
        if (message.includes('로그인 페이지로 이동하기')) {
            const loginUrl = "http://13.125.136.48:3000/login";
            const botResponse = {
                id: Date.now(),
                text: `로그인 페이지로 이동하려면 여기를 클릭하세요.`,
                sender: 'bot',
                url: loginUrl
            };
            setMessages(messages => [...messages, botResponse]);
            speak("로그인 페이지 링크를 보냈습니다.");
        }
        if (message.includes('통계 차트 보러가기')) {
            const statsUrl = "http://13.125.136.48:3000/sub";
            const botResponse = {
                id: Date.now(),
                text: `통계 차트 페이지로 이동하려면 여기를 클릭하세요.`,
                sender: 'bot',
                url: statsUrl
            };
            setMessages(messages => [...messages, botResponse]);
            speak("통계 차트 페이지 링크를 보냈습니다.");
        }
    };


    const handleGeolocationError = (error) => {
        let errorMessage = '';
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "위치 정보 접근이 거부되었습니다.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "위치 정보를 사용할 수 없습니다.";
                break;
            case error.TIMEOUT:
                errorMessage = "위치 정보를 가져오는 요청이 시간 초과되었습니다.";
                break;
            default:
                errorMessage = "알 수 없는 오류가 발생했습니다.";
                break;
        }
        const botResponse = {
            id: Date.now(),
            text: errorMessage,
            sender: 'bot'
        };
        setMessages(messages => [...messages, botResponse]);
        speak(botResponse.text);
    };

    return (
        <div className="chat_app">
            <div className="chat-container">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.url ? (
                            <Link to={msg.url}>{msg.text}</Link>
                        ) : (
                            msg.text
                        )}
                    </div>
                ))}
            </div>
            <div className="stations-list">
                <Chat stations={fuelStations} type="fuel"/>
            </div>
            <div className="stations-list">
                <Chat stations={chargingStations} type="charge"/>
            </div>

            <div className="user-input">
                <button onClick={() => handleMessage('내 주변 최저가 주유소 찾기')}>내 주변 최저가 주유소 찾기</button>
                <button onClick={() => handleMessage('내 주변 전기차 충전소 찾기')}>내 주변 전기차 충전소 찾기</button>
                <button onClick={() => handleMessage('고속도로 휴게소 정보 확인하러 가기')}>고속도로 휴게소 정보 확인하러 가기</button>
                <button onClick={() => handleMessage('로그인 페이지로 이동하기')}>로그인 페이지로 이동하기</button>
                <button onClick={() => handleMessage('통계 차트 보러가기')}>통계 차트 보러가기</button>
                <div className="tooltip">
                    <button className="voice-button" onClick={handleSpeech} disabled={isListening}>
                        <FaMicrophone/>
                        {isListening ? "듣는 중..." : "음성인식"}
                    </button>
                    <span className="tooltiptext">
                        음성인식 버튼을 누르고<br/> 주유소! or 전기차! 라고<br/> 음성으로 말씀하시면 <br/>그에 맞는 정보가 표시됩니다.<br/>
                        (주유소는 반경 5KM 내에 있는 최저가 주유소가,<br/> 전기차는 반경 5KM 내에 있는 전기차 충전소가 표시됩니다.)
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;