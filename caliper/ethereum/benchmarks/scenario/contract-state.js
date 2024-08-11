const ethers = require('ethers');
const crypto = require('crypto');
const execSync = require('child_process').execSync;
//import { execSync } from 'child_process';  

/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

const nameList = [
        'Emma', 'Isabella', 'Emily','Madison','Ava','Olivia','Sophia','Abigail','Elizabeth','Chloe','Samantha','Addison','Natalie','Mia',
        'Alexis','Alyssa','Hannah','Ashley','Ella','Sarah','Grace','Taylor','Brianna','Lily','Hailey','Anna','Victoria','Kayla','Lillian',
        'Lauren','Kaylee','Allison','Savannah','Nevaeh','Gabriella','Sofia','Makayla','Avery','Riley','Julia','Leah','Aubrey','Jasmine','Audrey',
        'Katherine','Morgan','Brooklyn','Destiny','Sydney','Alexa','Kylie','Brooke','Kaitlyn','Evelyn','Layla','Madeline','Kimberly','Zoe',
        'Jessica','Peyton','Alexandra','Claire','Madelyn','Maria','Mackenzie','Arianna','Jocelyn','Amelia','Angelina','Trinity','Andrea',
        'Maya','Valeria','Sophie','Rachel','Vanessa','Aaliyah','Mariah','Gabrielle','Katelyn','Ariana','Bailey','Camila','Jennifer','Melanie',
        'Gianna','Charlotte','Paige','Autumn','Payton','Faith','Sara','Isabelle','Caroline','Genesis','Isabel','Mary','Zoey','Gracie','Megan',
        'Haley','Mya','Michelle','Molly','Stephanie','Nicole','Jenna','Natalia','Sadie','Jada','Serenity','Lucy','Ruby','Eva','Kennedy',
        'Rylee','Jayla','Naomi','Rebecca','Lydia','Daniela','Bella','Keira','Adriana','Lilly','Hayden','Miley','Katie','Jade','Jordan','Gabriela',
        'Amy','Angela','Melissa','Valerie','Giselle','Diana','Amanda','Kate','Laila','Reagan','Jordyn','Kylee','Danielle','Briana','Marley','Leslie',
        'Kendall','Catherine','Liliana','Mckenzie','Jacqueline','Ashlyn','Reese','Marissa','London','Juliana','Shelby','Cheyenne','Angel','Daisy',
        'Makenzie','Miranda','Erin','Amber','Alana','Ellie','Breanna','Ana','Mikayla','Summer','Piper','Adrianna','Jillian','Sierra','Jayden',
        'Sienna','Alicia','Lila','Margaret','Alivia','Brooklynn','Karen','Violet','Sabrina','Stella','Aniyah','Annabelle','Alexandria','Kathryn',
        'Skylar','Aliyah','Delilah','Julianna','Kelsey','Khloe','Carly','Amaya','Mariana','Christina','Alondra','Tessa','Eliana','Bianca','Jazmin',
        'Clara','Vivian','Josephine','Delaney','Scarlett','Elena','Cadence','Alexia','Maggie','Laura','Nora','Ariel','Elise','Nadia','Mckenna',
        'Chelsea','Lyla','Alaina','Jasmin','Hope','Leila','Caitlyn','Cassidy','Makenna','Allie','Izabella','Eden','Callie','Haylee','Caitlin',
        'Kendra','Karina','Kyra','Kayleigh','Addyson','Kiara','Jazmine','Karla','Camryn','Alina','Lola','Kyla','Kelly','Fatima','Tiffany','Kira',
        'Crystal','Mallory','Esmeralda','Alejandra','Eleanor','Angelica','Jayda','Abby','Kara','Veronica','Carmen','Jamie','Ryleigh','Valentina'
    ];

    

 const lastName = 
 [
    'Smith','Johnson','Williams','Brown','Jones','Miller','Davis','Garcia','Rodriguez','Wilson','Martinez','Anderson','Taylor','Thomas',
    'Hernandez','Moore','Martin','Jackson','Thompson','White','Lopez','Lee','Gonzalez','Harris','Clark','Lewis','Robinson','Walker','Perez',
    'Hall','Young','Allen','Sanchez','Wright','King','Scott','Green','Baker','Adams','Nelson','Hill','Ramirez','Campbell','Mitchell','Roberts',
    'Carter','Phillips','Evans','Turner','Torres','Parker','Collins','Edwards','Stewart','Flores','Morris','Nguyen','Murphy','Rivera','Cook',
    'Rogers','Morgan','Peterson','Cooper','Reed','Bailey','Bell','Gomez','Kelly','Howard','Ward','Cox','Diaz','Richardson','Wood','Watson',
    'Brooks','Bennett','Gray','James','Reyes','Cruz','Hughes','Price','Myers','Long','Foster','Sanders','Ross','Morales','Powell','Sullivan',
    'Russell','Ortiz','Jenkins','Gutierrez','Perry','Butler','Barnes','Fisher','Henderson','Coleman','Simmons','Patterson','Jordan','Reynolds',
    'Hamilton','Graham','Kim','Gonzales','Alexander','Ramos','Wallace','Griffin','West','Cole','Hayes','Chavez','Gibson','Bryant','Ellis','Stevens',
    'Murray','Ford','Marshall','Owens','Mcdonald','Harrison','Ruiz','Kennedy','Wells','Alvarez','Woods','Mendoza','Castillo','Olson','Webb',
    'Washington','Tucker','Freeman','Burns','Henry','Vasquez','Snyder','Simpson','Crawford','Jimenez','Porter','Mason','Shaw','Gordon','Wagner',
    'Hunter','Romero','Hicks','Dixon','Hunt','Palmer','Robertson','Black','Holmes','Stone','Meyer','Boyd','Mills','Warren','Fox','Rose','Rice',
    'Moreno','Schmidt','Patel','Ferguson','Nichols','Herrera','Medina','Ryan','Fernandez','Weaver','Daniels','Stephens','Gardner','Payne',
    'Kelley','Dunn','Pierce','Arnold','Tran','Spencer','Peters','Hawkins','Grant','Hansen','Castro','Hoffman','Hart','Elliott','Cunningham',
    'Knight','Bradley','Carroll','Hudson','Duncan','Armstrong','Berry','Andrews','Johnston','Ray','Lane','Riley','Carpenter','Perkins','Aguilar',
    'Silva','Richards','Willis','Matthews','Chapman','Lawrence','Garza','Vargas','Watkins','Wheeler','Larson','Carlson','Harper','George',
    'Greene','Burke','Guzman','Morrison','Munoz','Jacobs','Obrien','Lawson','Franklin','Lynch','Bishop','Carr','Salazar','Austin','Mendez',
    'Gilbert','Jensen','Williamson','Montgomery','Harvey','Oliver','Howell','Dean','Hanson','Weber','Garrett','Sims','Burton','Fuller','Soto',
    'Mccoy','Welch','Chen','Schultz','Walters','Reid','Fields','Walsh','Little','Fowler','Bowman','Davidson','May','Day','Schneider','Newman'
 ];
     
 const disciplines =
 [
     'Biology','Biochemistry','Chemistry','Communication','English','Economics','History','Latin','Mathematics','Music','Physics',
     'Psychology','Spanish','Theatre','Portuguese'
 ];


 const evaluationComment = 
 [
    'Good Work','You need improve some points','Terrible work','It is a ok enough to be approved'
 ];

/**
 * Class for managing contract account states.
 */
class ContractState {

    /**
     * Initializes the instance.
    */
    constructor(workerIndex, args) {
        this.vQtdDays = args[0]; //qtddays
        this.vQtdUsers = args[1];
        this.vQtdStudents = args[2];;
        this.vQtdTeachers = args[3];;
        this.vQtdPatients = args[4];;
        this.vQtdDoctors = args[5];;
        
         
        this.vListAddressStudent =[];
        this.vListAddressTeacher = [];
    
    }   

    /**
     * Returns a random account key.
     * @return {string} Account key.
     * @private
     */
    _getRandomAccount() {
      
        var id = crypto.randomBytes(32).toString('hex');
        var privateKey = "0x"+id;
        //console.log("SAVE BUT DO NOT SHARE THIS:", privateKey);

        var wallet = new ethers.Wallet(privateKey);
        //console.log("Address: " + wallet.address);
        return wallet.address;
    }

    _getHardHatRandomAccount() {
      
         const output = execSync('npx hardhat getRandomAccount', { encoding: 'utf-8',   cwd: '/hardhat' });  // the default is 'buffer'
         
         return output.trim();
     }


    getWeiPayableFunction(range) 
        {
          ///  console.log(range)
          if (range=='low')
             return ethers.utils.parseEther("0.00001");
                                               
          else // High
             return ethers.utils.parseEther("0.1");
            
          //ethers.utils.formatEther(WEI_VALUE)
        }; //hre.ethers.parseEther("0.00001")
      

       
        getTaxDayToPay() { 
            let amount = ethers.utils.parseEther("0.000005");
            return  {
                _amount: amount,
                _qtdDay: 1,
            };
        }

        getEnroll() { 
            return  {
                _roll: this.getRandomInt(1000),
                _year: this.getRandomIntInterval(2015,2024),
                 
            };
        }

        setAttendance()
        {
            return  {
                _aTeach: this.getRandomTeacherAddress(),
                _aStud: this.getRandomStudentAddress()
                 
            };
        }

        getRamdomFirstname()
        {
            //console.log('index',nameList[Math.floor(Math.random() * nameList.length)]);
            return  (nameList[Math.floor(Math.random() * nameList.length)]);

        }

        getRamdomLastname()
        {
            //console.log('index',lastName[Math.floor(Math.random() * lastName.length)]);
            return  (lastName[Math.floor(Math.random() * lastName.length)]);

        }

        getRamdomDiscipline()
        {
            return  (disciplines[Math.floor(Math.random() * disciplines.length)]);

        }
        
        getRandomTeacherAddress()
        {
            return  (this.vListAddressTeacher[Math.floor(Math.random() * this.vListAddressTeacher.length)]);
        }

        getRandomStudentAddress()
        {
            return  (this.vListAddressStudent[Math.floor(Math.random() * this.vListAddressStudent.length)]);
        }

        getRandomComment()
        {
            return  (evaluationComment[Math.floor(Math.random() * evaluationComment.length)]);

        }
        getHistory()
        {
            return  {
                _aStud:   this.getRandomStudentAddress(),
                _aTeach:  this.getRandomTeacherAddress(),
                _comment: this.getRandomComment()
           };

        }
        getStudents()
        { 
            let vAddress = this._getRandomAccount();
            //console.log(vAddress);
            this.vListAddressStudent.push(vAddress);
            return  {

                 _studId:  this.getRandomInt(500),
                 _age:   this.getRandomIntInterval(18,40),
                _fName:  this.getRamdomFirstname(),
                _lName:  this.getRamdomLastname(),
                _aStud: vAddress,
                
                 
            };
        }


        getMsgSender(_Sender ) 
        {
                return {_Sender: _Sender}

        }

        getTeachers()
        { 
            let vAddress = this._getRandomAccount();
            this.vListAddressTeacher.push(vAddress);
            return  {
                _teachId:  this.getRandomInt(500),
                _fName:  this.getRamdomFirstname(),
                _lName:   this.getRamdomLastname(),
                _discipline: this.getRamdomDiscipline(),
                _aTeach: vAddress
                 
            };
        }

        getStartVisit()
        {
            const currentDate = new Date();
            const timestamp = currentDate.getTime();   
            return 
            {
                _time: timestamp
            };

        }

        getAddDoctors()
        {
            return {
                _doctor_address: this._getRandomAccount()
            }
        }

        getAddAudits()
        {
            return {
                _audit_address: this._getRandomAccount()
            }
        }

        getRandomInt(max) {
            return Math.floor(Math.random() * max);
          }

           getRandomIntInterval(min, max) {
            const minCeiled = Math.ceil(min);
            const maxFloored = Math.floor(max);
            return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
          }

          
    }

module.exports = ContractState;
