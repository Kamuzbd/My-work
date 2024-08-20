let availablekeywords = [
  'Naruto',
  'Vinland saga',
  'Black clover',
  'Death note',
  'Wind breaker',
  'Mushoku Tensei',
  'Demon Slayer',
  'Kaiju No. 8',
  'Delicious in Dungeon',
  'My Oni Girl',
  '5 Centimeters per Second',
  'Solo Leveling',
  'Another',
  'MASHLE',
  'Tomo-chan Is a Girl!',
  'My Love Story',
  'Got a Cheat Skill',
  'One Punch Man',
  'Jujutsu Kaisen',
  'SPY x FAMILY',
  'BLUELOCK',
  'Suzume',
  'A Silent Voice',
  'Zom 100',
  'Buddy Daddies',
  'Baki Hanma',
  'My Dress-Up Darling',
  'Weathering with You',
  'Lookism',
  'I Want to Eat Your Pancreas',
  'The Garden of Words',
  'Tokyo Revengers',
  'Horimiya: The Missing Pieces',
  'Your Name',
  'High School D×D',
  'Prison School',
  'Viral hit',
  'Chainsaw Man',
  'Attack on Titan',
  'Tokyo Ghoul',
  'Junji Ito Collections',
  'Oshi No Ko',
  'DEVIL PART TIMER SEASON',
  'Perfect Blue',
  'Classroom of the Elite',
  'Quality Assurance in Another World',
  'My One-Hit Kill Sister',
  'Valkyria Chronicles',
  'My Hero Academia',
  'Dr. STONE',
  'The Iceblade Sorcerer Shall Rule the World',
  '',
  '',
  '',
  '',
  '',
];

const resultsbox = document.querySelector(".result-box")
const inputbox = document.querySelector("#input-box")

inputbox.onkeyup = function(){
    let result = [];
    let input = inputbox.value;
    if(input.length){
        result = availablekeywords.filter(( keywords )=>{
        return keywords.toLowerCase().includes(input.toLowerCase());
        });
        // console.log(result);
    }
    display(result);

    if(!result.length)
        resultsbox.innerHTML = ' ';
}
function display(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this)>" + list + "</li>";
    });

    resultsbox.innerHTML = "<ul>" + content.join('') + "</ul>";
}


function selectInput(list){
 inputbox.value = list.innerHTML;
 resultsbox.innerHTML = '';

}