# Stop scan

## 프로젝트 소개 
고속도로를 이용하는 운전자들을 위해 다양한 고속도로 휴게소, 주유소, 전기차 충전소 정보를 제공하는 웹 애플리케이션입니다.  
실시간 정보, 주변 편의시설, 관광 명소 등을 한눈에 확인할 수 있다.

## 프로젝트 팀 
- **엄현빈** - 프로젝트 관리,데이터수집,백엔드 개발,UI디자인 
- **이재우** - 프론트엔드 개발,게시판기능,백엔드 개발
- **위지은** - 통계페이지 개발,프론트엔드 개발 
- **조수호** - 챗봇개발,프론트엔드 개발


## 기능
- 고속도로별 휴게소 정보 조회 
- 휴게소 상세 정보 및 편의시설 확인
- 지도 기반 휴게소 위치확인
- 주변 주유소 및 충전소 실시간 상태확인 
- 제주도 관광명소,제주도 충전소 실시간 상태확인
- 음성인신 기능을 통한 정보제공 챗봇
- 실시간 유가차트 확인 


## 사용기술

- **프론트엔드**: React, CSS Modules, Kakao Maps SDK
- **백엔드**: Node.js, Express
- **데이터분석**: 
- **데이터수집**: Flask
- **데이터베이스**: oracleDB
- **배포**: AWS EC2

## 프로젝트 관리 

![image](./readmeImg/1.png)   
각 서버를 효율적으로 관리하기 위해, React, Express, 그리고 Flask를 사용하는 세 개의 서버에 각각 원격 레포지토리를 생성

   
![image](./readmeImg/2.png)   
각자가 자신의 브랜치를 만들어 작업하고, 마스터 브랜치에 업데이트하는 방식으로 작업을 진행

![image](./readmeImg/3.png)


## 주요기능 스크린샷 


![image](./readmeImg/메인화면검색.png)   
메인화면에서 고속도로를 선택하고 검색을 누름.

![image](./readmeImg/동해.png)  
선택한 해당 노선에 있는 휴게소 리스트가 나오고 맵에 마커로 표시
![image](./readmeImg/주유소찾기.png)   
실시간 내위치를 기반으로 반경내 주유소 , 충전소 의 가격과 실시간 상태를 제공
![image](./readmeImg/제주관광.png)   
카테고리별 선택, 태그별 선택으로 관광지 정보제공
![image](./readmeImg/제주전기차충전소.png)
제주도 전기차 충전소 상태 제공
![image](./readmeImg/통계.png)   
유가차트와 실시간 내 주변 주유소,충전소 차트 
   
![image](./readmeImg/챗봇.png) 

   








