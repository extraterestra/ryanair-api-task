class Logger {
  logRequest(method, url, headers = {}, body = null) {
    console.log('\n' + '='.repeat(80));
    console.log('📤 REQUEST');
    console.log('='.repeat(80));
    console.log(`Method: ${method}`);
    console.log(`URL: ${url}`);
    if (Object.keys(headers).length > 0) {
      console.log('Headers:');
      Object.entries(headers).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }
    if (body) {
      console.log('Body:');
      console.log(JSON.stringify(body, null, 2));
    }
  }

  logCurl(curl) {
    console.log('\n📋 CURL Command:');
    console.log('-'.repeat(80));
    console.log(curl);
  }

  logResponse(status, headers = {}, body = null) {
    console.log('\n' + '='.repeat(80));
    console.log('📥 RESPONSE');
    console.log('='.repeat(80));
    console.log(`Status: ${status}`);
    if (Object.keys(headers).length > 0) {
      console.log('Headers:');
      Object.entries(headers).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }
    if (body) {
      console.log('Body:');
      console.log(JSON.stringify(body, null, 2));
    }
    console.log('='.repeat(80) + '\n');
  }

  logError(error) {
    console.log('\n' + '❌ ERROR'.red);
    console.log('='.repeat(80));
    console.log(error.message);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    console.log('='.repeat(80) + '\n');
  }

  logStep(stepName) {
    console.log(`\n🔹 ${stepName}`);
  }
}

module.exports = new Logger();
