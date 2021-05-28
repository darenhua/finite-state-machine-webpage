function createMachine(stateMachineDefinition) {
  const machine = {
    value: stateMachineDefinition.initialState,
    transition(currentState, event) {
      const currentStateDefinition = stateMachineDefinition[currentState]
      const destinationTransition = currentStateDefinition.transitions[event]
      if (!destinationTransition) {
        return
      }
      const destinationState = destinationTransition.target
      const destinationStateDefinition =
        stateMachineDefinition[destinationState]
      destinationTransition.action()
      currentStateDefinition.actions.onExit()
      destinationStateDefinition.actions.onEnter()
      machine.value = destinationState
      return machine.value
    },
  }
  return machine
}

const machine = createMachine({
  initialState: 'default',
  default: {
    actions: {
      onEnter() {
        console.log('off: onEnter')
      },
      onExit() {
        console.log('off: onExit')
      },
    },
    transitions: {
      switch: {
        target: 'select_default',
        action() {
          console.log('transition action for "switch" in "default" state')
          document.querySelector(".modal-container").style.display = "flex";

        },
      },
    },
  },
  select_default: {
    actions: {
      onEnter() {
        console.log('on: onEnter')
      },
      onExit() {
        console.log('on: onExit')
      },
    },
    transitions: {
      switch: {
        target: 'select_active',
        action() {
          console.log('transition action for "switch" in "select-default" state')
          //only display active input card
          modal = document.querySelectorAll(".state-select");
          inputs = document.querySelectorAll(".radio");
          inputs.forEach((input, index) => {
            if (input.checked === true) {
              modal[index].style.display = "block";
            } else {
              modal[index].style.display = "none";
            }
          });
        },
      },
      cancel: {
        target: "default",
        action() {
          console.log('transition action for "cancel" in "select-default" state')
          document.querySelector(".modal-container").style.display = "none";

        },

      }
    },
  },
  select_active: {
    actions: {
      onEnter() {
        console.log('on: onEnter')
      },
      onExit() {
        console.log('on: onExit')
      },
    },
    transitions: {
      switch: {
        target: 'select_entered',
        action() {
          console.log('transition action for "switch" in "select-active" state')
        },  
      },
      cancel: {
        target: "default",
        action() {
          console.log('transition action for "cancel" in "select-default" state')
          document.querySelector(".modal-container").style.display = "none";

        },

      }

    },
  },
  select_entered: {
    actions: {
      onEnter() {
        console.log('on: onEnter')
      },
      onExit() {
        console.log('on: onExit')
      },
    },
    transitions: {
      switch: {
        target: 'complete',
        action() {
          console.log('transition action for "switch" in "select-default" state')
          //only display active input card
          document.querySelector(".modal-container").style.display = "none";
          document.querySelector(".completed-container").style.display = "flex";
        },  
      },
      cancel: {
        target: "default",
        action() {
          console.log('transition action for "cancel" in "select-default" state')
          document.querySelector(".modal-container").style.display = "none";

        },

      }

    },
  },

  complete: {
    actions: {
      onEnter() {
        console.log('on: onEnter')
      },
      onExit() {
        console.log('on: onExit')
      },
    },
    transitions: {
      switch: {
        target: 'default',
        action() {
          console.log('transition action for "switch" in "default" state')
          document.querySelector(".completed-container").style.display = "none";
        },
      },
    },
  }
})

let state = machine.value
console.log(`current state: ${state}`)
const select_btns = document.querySelectorAll(".select-btn");
const close_btn = document.querySelector(".close-modal");
const radios = document.querySelectorAll(".radio");
const cards_selected = document.querySelectorAll(".state-select");
const text_inps = document.querySelectorAll(".pledge-amt input");

const submit_btns = document.querySelectorAll(".submit-btn");
const complete_btn = document.querySelector("#complete-btn");
const bookmark_btn = document.querySelector(".bookmark-button");

if (window.localStorage.getItem("bookmark_on")){
  bookmark_btn.classList.add("active");

}

select_btns.forEach((button)=> {
  button.addEventListener("click", ()=> {
    if (state==="default")
      state = machine.transition(state, 'switch')
      document.querySelector('form').reset();

  })
})

close_btn.addEventListener("click", ()=> {
  state = machine.transition(state, 'cancel')
  cards_selected.forEach((card)=> {
    card.style.display = "none";
  })
})

radios.forEach((input)=> {
  input.addEventListener("click", ()=> {
    if (state==="select_default"){
      state = machine.transition(state, 'switch')
    }
    else if (state==="select_active"){
      radios.forEach((input, index) => {
        if (input.checked === true) {
          cards_selected[index].style.display = "block";
        } else {
          cards_selected[index].style.display = "none";
        }
      })
    }
  })
})

let temp;

text_inps.forEach((input, index)=> {
  input.addEventListener("change", ()=> {
    if (state==="select_active")
      temp=index;
      state = machine.transition(state, 'switch')
  })
})

submit_btns.forEach((button, index)=> {
  button.addEventListener("click", ()=> {
    if (state==="select_entered" && Number.isInteger(parseInt(text_inps[temp].value)))
      state = machine.transition(state, 'switch')
    else if (index === 0) {
      state = machine.transition(state, 'switch');
      state = machine.transition(state, 'switch');

    }
    else if (!Number.isInteger(parseInt(text_inps[temp].value)))
      alert("Please enter a number");
  })
})

complete_btn.addEventListener("click", ()=> {
  if (state==="complete")
    state = machine.transition(state, 'switch')
    cards_selected.forEach((card)=> {
      card.style.display = "none";
    })
  
})

bookmark_btn.addEventListener("click", ()=>{
  bookmark_btn.classList.toggle("active");
  if (bookmark_btn.classList.contains("active")) {
    window.localStorage.setItem("bookmark_on", true);       
  } else{
    window.localStorage.setItem("bookmark_on", false);       
  }
})