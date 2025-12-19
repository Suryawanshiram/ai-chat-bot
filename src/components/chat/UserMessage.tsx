import { User } from "lucide-react";
import { TextMessage } from "./TextMessage";
import type { MessagePart } from "@/types/message";

interface UserMessageProps {
  part: MessagePart;
}

export function UserMessage({ part }: UserMessageProps) {
  if (part.type !== "text") {
    return null;
  }

  return (
    <div className="flex gap-3 justify-end">
      <div className="flex gap-3 w-[80%] flex-row-reverse">
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground text-right">
            <TextMessage text={part.text} />
          </div>
        </div>
      </div>
    </div>
  );
}

// import { User } from "lucide-react";
// import { TextMessage } from "./TextMessage";
// import type { MessagePart } from "./message-types";

// interface UserMessageProps {
//   part: MessagePart;
// }

// export function UserMessage({ part }: UserMessageProps) {
//   if (part.type !== "text") {
//     return null;
//   }

//   return (
//     <div className="flex gap-3 justify-end">
//       <div className="flex gap-3 w-[80%] flex-row-reverse">
//         <div className="shrink-0">
//           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//             <User className="w-4 h-4 text-primary-foreground" />
//           </div>
//         </div>

//         <div className="w-full">
//           <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground text-right">
//             <TextMessage text={part.text} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { User } from "lucide-react";
// import { TextMessage } from "./TextMessage";

// type TextPart = {
//   type: "text";
//   text: string;
// };

// type MessagePart = TextPart | { type: string };

// interface UserMessageProps {
//   part: MessagePart;
// }

// export function UserMessage({ part }: UserMessageProps) {
//   if (part.type !== "text") {
//     return null;
//   }

//   return (
//     <div className="flex gap-3 justify-end">
//       <div className="flex gap-3 w-[80%] flex-row-reverse">
//         <div className="shrink-0">
//           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//             <User className="w-4 h-4 text-primary-foreground" />
//           </div>
//         </div>
//         <div className="w-full">
//           <div className="space-y-2">
//             <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground text-right">
//               <TextMessage text={part.text} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
