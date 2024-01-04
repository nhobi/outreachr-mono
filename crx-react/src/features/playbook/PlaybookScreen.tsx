import { createPortal } from "react-dom";
import { useSession } from "../session/SessionContext"

const playbooks = {
    "Network Expansion 📈": {
        "steps": [
          {
            "id": "1.icebreaker",
            "emoji": "🧊",
            "label": "Break the Ice",
            "instructions": "Mark this step complete once you've recieved a _response_ to your initial message. You can continue to follow up on a regular interval until you recieve a response."
          },
          {
            "id": "2.connect",
            "emoji": "🧱",
            "label": "Solidify Connection",
            "instructions": "Once your connection has responded, your goal is now to build an authentic connection with this person. **Mark this step complete** when you've had 2-3 organic interactions on LinkedIn or within another context. Talk about shared interests, shared community or any overlap in your professional journeys."
          },
          {
            "id": "3.ask",
            "emoji": "❤️",
            "label": "Ask for Relevant Connections",
            "instructions": "Now that you _actually_ have things to talk about, schedule a 10-15m connection call where you can formally ask for 2-3 connection recommendations (can be formal intro, but doens't have to be). Mark this step complete when you've had the call and you've gotten 2-3 names."
          }            
        ],
        "description": "Use this playbook to expand your network by finding and building authentic connections with others. The only _ask_ is for additional connections that may be relevant to you once you've established an authentic connection.",
        "allowMultipleSteps": false
      }
};
export const PlaybookScreen = () => {
    const {currentUser} = useSession();

    if(!currentUser) return null;

    const pbKey = "Network Expansion 📈";
    const playbook = playbooks[pbKey];
    
    const el = document.querySelector('.msg-form__msg-content-container--scrollable');

    return <>
        {el && createPortal(<button className="bg-gradient-to-l  from-purple-100 to-blue-200 rounded-md">Playbooks 🚀</button>, el)}
    </>
}


