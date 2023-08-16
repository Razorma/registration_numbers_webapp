import assert from 'assert';
import registrationNumbers from '../database.js';
import {sqlTableQueries,db} from "../index.js"


const registrationService = registrationNumbers(db,sqlTableQueries);
describe('Database Functions', function () {
    this.timeout(7000);
  before(async function () {
    await registrationService.createRegTable();
  });

  afterEach(async function () {
    await registrationService.removeAllRegNumbers();
  });

  it('should add registration numbers', async function () {
    await registrationService.addRegistrationNumberForTown('CA 122323', "CapeTown");
    await registrationService.addRegistrationNumberForTown('CJ 122327', "paarl");

    const regNumbers = await registrationService.getRegistrations();

    assert.equal(regNumbers.length, 2);
    assert.equal(regNumbers[0].registration_number, 'CA 122323');
    assert.equal(regNumbers[1].registration_number, 'CJ 122327');

  });

  it('should get the registration numbers for a specific town', async function () {
    await registrationService.addRegistrationNumberForTown('CA 122323', "CapeTown");
    await registrationService.addRegistrationNumberForTown('CJ 122327', "paarl");
    await registrationService.addRegistrationNumberForTown('CA 122322', "CapeTown");
    await registrationService.addRegistrationNumberForTown('CJ 122321', "paarl");

    const regNumbers = await registrationService.getRegistrationNumberForTown("paarl");
    assert.deepEqual(regNumbers, [
        { registration_number: 'CJ 122327' },
        { registration_number: 'CJ 122321' }
      ]);
  });

  it('should remove all registration numbers', async function () {
    await registrationService.addRegistrationNumberForTown('CA 122323', "CapeTown");
    await registrationService.addRegistrationNumberForTown('CJ 122327', "paarl");

    await registrationService.removeAllRegNumbers();

    const regNumbers= await registrationService.getRegistrations();
    assert.strictEqual(regNumbers.length, 0);
  });
});
