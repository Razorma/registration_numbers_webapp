import assert from "assert";
import displayRegNumbers from "../registration_number.js";

describe('registration number Function tests', function () {
    it('it should not return the same registration number twice', function () {
      let display = displayRegNumbers();
      display.setRegNumber('CA 12558');
      display.setRegNumber('CA 12558');
      display.setRegNumber('CA 12558');
      assert.equal(display.regNumberCounter(), 1);
    });
  
    it('it should return every town if not filltered', function () {
      let display = displayRegNumbers();
      display.setRegNumber('CK 12558');
      display.setRegNumber('CK 12558');
      display.setRegNumber('CL 12558');
      display.setTown('');
      assert.deepEqual(display.getAllTown(), ['CA 12558', 'CK 12558', 'CL 12558']);
    });
  
    it('it should return a registration number from Paarl if Paarl is selected', function () {
      let display = displayRegNumbers();
      display.setRegNumber('CK 12558');
      display.setRegNumber('CY 12558');
      display.setRegNumber('CJ 12558');
      display.setTown('CJ');
      assert.deepEqual(display.getTown(), ['CJ 12558']);
    });
  
    it('it should return registration numbers from Bellville if Bellville is selected', function () {
      let display = displayRegNumbers();
      display.setRegNumber('CK 12558');
      display.setRegNumber('CF 12558');
      display.setRegNumber('CY 12558');
      display.setRegNumber('CY 12568');
      display.setTown('CY');
      assert.deepEqual(display.getTown(), ['CY 12558', 'CY 12568']);
    });
  
    it('it should return registration numbers from Malmesbury if Malmesbury is selected', function () {
      let display = displayRegNumbers();
      display.setRegNumber('CF 12558');
      display.setRegNumber('CK 125758');
      display.setRegNumber('CK 12558');
      display.setRegNumber('CK 12568');
      display.setTown('CK');
      assert.deepEqual(display.getTown(), ['CK 12558', 'CK 125758', 'CK 12568']);
    });
    it('it should return registration numbers from capeTown if capeTown is selected', function () {
      let display = displayRegNumbers();
      display.setRegNumber('CK 12558');
      display.setRegNumber('CA 12555');
      display.setRegNumber('CA 12558');
      display.setRegNumber('CA 12568');
      display.setTown('CA');
      assert.deepEqual(display.getTown(), ['CA 12558', 'CA 12555', 'CA 12568']);
    });
  
    it('it should return a registration number from Stellenbosch if Stellenbosch is selected', function () {
      let display = displayRegNumbers();
      display.setRegNumber('CK 12558');
      display.setRegNumber('CK 12558');
      display.setRegNumber('CL 12558');
      display.setTown('CL');
      assert.deepEqual(display.getTown(), ['CL 12558']);
    });
  
    it('it should return an alert message if the ragistration number entered is not from the Paarl, Bellville, Stellenbosch, Malmesbury, Cape-Town, or Kuilsriver', function () {
      let display = displayRegNumbers();
      display.setRegNumber('CH 12558');
      assert.deepEqual(display.getError(), "Enter only registrations from Paarl, Bellville, Stellenbosch, Malmesbury, Cape-Town, and Kuilsriver (See the select town Dropdown menu for formats)");
    });
  
  });