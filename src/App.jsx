// App.jsx or your main component
import React from 'react';
import Header from './component/header/navbar';
import MapComponent from './component/MapComponent';

const App = () => {
    const mapComponentRef = React.useRef();

    const handleSearchMission = (missionName) => {
        console.log('Searching for mission:', missionName);
        // Perform search logic here
        if (mapComponentRef.current) {
            mapComponentRef.current.loadMissionShapes(missionName);
        } else {
          console.error("MapcomponentRef not avaible")
        }
    };

    return (
        <div>
            <Header onSearchMission={handleSearchMission} />
            <MapComponent ref={mapComponentRef} />
        </div>
    );
};

export default App;
