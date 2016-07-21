var app = require('./backend/server-config.js');

app.listen(process.env.PORT || 3000, function() {
  console.log('Server is running on port 3000');
});
