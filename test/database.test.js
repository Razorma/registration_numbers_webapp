import assert from 'assert';
import {
    createRegTable,
    addRegistrationNumberForTown,
    getRegistrations,
    getRegistrationNumberForTown,
    removeAllRegNumbers,
} from '../database.js';


describe('Database Functions', function () {
    this.timeout(7000);
  before(async function () {
    await createRegTable();
  });

  afterEach(async function () {
    await removeAllRegNumbers();
  });

  it('should add registration numbers', async function () {
    await addRegistrationNumberForTown('CA 122323', "CapeTown");
    await addRegistrationNumberForTown('CJ 122327', "paarl");

    const regNumbers = await getRegistrations();

    assert.equal(regNumbers.length, 2);
    assert.equal(regNumbers[0].registration_number, 'CA 122323');
    assert.equal(regNumbers[1].registration_number, 'CJ 122327');

  });

  it('should get the registration numbers for a specific town', async function () {
    await addRegistrationNumberForTown('CA 122323', "CapeTown");
    await addRegistrationNumberForTown('CJ 122327', "paarl");
    await addRegistrationNumberForTown('CA 122322', "CapeTown");
    await addRegistrationNumberForTown('CJ 122321', "paarl");

    const regNumbers = await getRegistrationNumberForTown("paarl");
    assert.deepEqual(regNumbers, [
        { registration_number: 'CJ 122327' },
        { registration_number: 'CJ 122321' }
      ]);
  });

  it('should remove all registration numbers', async function () {
    await addRegistrationNumberForTown('CA 122323', "CapeTown");
    await addRegistrationNumberForTown('CJ 122327', "paarl");

    await removeAllRegNumbers();

    const regNumbers= await getRegistrations();
    assert.strictEqual(regNumbers.length, 0);
  });
});
