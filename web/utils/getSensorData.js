import Device from "../models/deviceModel.js";

async function getTemperatureAndHumidityAndLight(userID) {
    const devices = await Device.getDevicesByUserId(userID);
    if (!devices || devices.length === 0) {
        console.log("No devices found for this user");
        return null;
    }

    const temperatureAndSmokingDevices = devices.filter(
        (device) => device.type === "fire_smoke"
    );
    const data = [];
    for (const device of temperatureAndSmokingDevices) {
        const historicalData = await device.getHistoricalData(1);
        data.push({
            device: device.uid,
            name: device.name,
            type: device.type,
            temperature: historicalData[0].temperature,
            humidity: historicalData[0].humidity,
            light: historicalData[0].light,
            timestamp: historicalData[0].timestamp,
        });
    }
    return data;
}

export default getTemperatureAndHumidityAndLight;
