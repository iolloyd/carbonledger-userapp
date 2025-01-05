// Web Worker for processing energy data
self.onmessage = function(e) {
  const { data, timeframe } = e.data;
  
  // Process data based on timeframe
  let processedData = data.map(item => ({
    time: item.timestamp,
    usage: calculateUsage(item.readings, timeframe)
  }));

  // Sort data by time
  processedData.sort((a, b) => new Date(a.time) - new Date(b.time));
  
  self.postMessage(processedData);
};

function calculateUsage(readings, timeframe) {
  // Sample calculation - in reality this would be more complex
  return readings.reduce((sum, reading) => sum + reading, 0);
}
