describe("Application", function() {

    this.timeout(20000);

    it("app", function(done) {
        require("dotenv").config();
        const {
            postgres: { sequelize }
        } = require("../lib/databases");
        const config = require("config");
        const serverConfig = config.get("server");

        var app = require("../lib/app");

        // console.log(`*** SERVER Info: ENVIRONMENT: ${process.env.NODE_ENV}`);

        app.listen(3001, async () => {
            require("../lib/databases/postgres/init")().then(() => {
                // console.log(`*** SERVER Info: Server is running on port ${serverConfig.port}...`);
                done();
            });

        });

    });

    describe("Game", function() {

        require("./Game/attributes");
    });


});



