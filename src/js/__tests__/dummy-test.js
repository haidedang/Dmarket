import Dummy from '../dummy'; 

jest.setTimeout(60000);

describe('dummy', () => {
    it('should initiate correctly', async () => {
        let dummy = new Dummy(); 
        await dummy.init(); 
        
    })
})