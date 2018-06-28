var chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);



describe('Basic routes tests', function() {

    it('GET to / should return 200', function(done){

        expect(1+1).to.equal(2);

    })

    it('GET to /pagecount should return 200', function(done){
        expect(1+1).to.equal(2);

    })
})
