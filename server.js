var app = require('./backend/server_config.js');

app.listen(process.env.PORT || 3000, function(){
  console.log('Server is running on port ', process.env.PORT || '3000');
});
