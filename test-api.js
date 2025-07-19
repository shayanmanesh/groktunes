// Test script for GrokTunes API
// Usage: node test-api.js

const API_URL = 'http://localhost:8787'; // Change to your deployed URL

async function testAPI() {
  console.log('Testing GrokTunes API...\n');

  // 1. Test Health Check
  console.log('1. Testing Health Check...');
  try {
    const health = await fetch(`${API_URL}/api/health`);
    const healthData = await health.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
  }

  // 2. Test Analysis (without audio)
  console.log('\n2. Testing Analysis...');
  try {
    const analysis = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcription: 'Just a small town girl living in a lonely world',
        songData: { title: 'Test Song', artist: 'Test Artist' }
      })
    });
    const analysisData = await analysis.json();
    console.log('✅ Analysis Response:', analysisData);
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }

  // 3. Test Visual Generation
  console.log('\n3. Testing Visual Generation...');
  try {
    const visual = await fetch(`${API_URL}/api/generate-visual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Abstract music visualization with waves',
        style: 'synthwave'
      })
    });
    const visualData = await visual.json();
    console.log('✅ Visual Generation:', visualData.imageUrl ? 'Image generated' : 'Failed');
  } catch (error) {
    console.error('❌ Visual Generation failed:', error.message);
  }

  console.log('\n✅ API tests complete!');
}

testAPI();