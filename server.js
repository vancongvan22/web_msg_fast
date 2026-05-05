const app = require('./api/index');
const port = 3000;

app.listen(port, () => {
    console.log(`Web chay tai: http://localhost:${port}`);
});