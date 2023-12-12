// import { useCallback, useEffect, useState } from "react";
//
// import { subscribe } from "~/nostr-query/lib/relay";
// import { type UseSubEventsParams } from "~/nostr-query/types";
// import { type Event } from "nostr-tools";
//
// import defaultPool from "../../lib/pool";
//
// // TODO: load newer events function
// const useProfileEvent = ({
//   pool = defaultPool,
//   relays,
//   filter,
//   initialEvents = [],
//   setEvents = (events) => {
//     console.debug("setEvents called", events);
//   },
//   onEvent = (event) => {
//     console.debug("onEvent called", event);
//   },
//   onEOSE = () => {
//     console.debug("onEOSE called");
//   },
//   onEventPredicate = () => true,
// }: UseSubEventsParams) => {
//   const [loading, setLoading] = useState(true);
//
//   const _onEOSE = () => {
//     setLoading(false);
//     onEOSE();
//   };
//
//   const loadOlderEvents = useCallback(
//     (existingEvents: Event[] | undefined, limit: number) => {
//       let _filter = filter;
//
//       if (limit > 0) {
//         _filter = { ...filter, limit };
//       }
//
//       setLoading(true);
//       const _setEvents = (events: Event[]) => {
//         if (!existingEvents) {
//           setEvents(events);
//           setLoading(false);
//           return;
//         }
//         setEvents([...existingEvents, ...events]);
//         setLoading(false);
//       };
//
//       if (existingEvents === undefined || existingEvents.length === 0) {
//         subscribe({
//           pool,
//           relays,
//           filter,
//           setEvents: _setEvents,
//           onEvent,
//           onEOSE: _onEOSE,
//           onEventPredicate,
//         });
//         return;
//       }
//
//       const lastEvent = existingEvents[existingEvents.length - 1];
//
//       if (!lastEvent) {
//         subscribe({
//           pool,
//           relays,
//           filter,
//           setEvents: _setEvents,
//           onEvent,
//           onEOSE: _onEOSE,
//           onEventPredicate,
//         });
//         return;
//       }
//
//       const until = lastEvent.created_at - 10;
//
//       _filter = { ..._filter, until };
//
//       subscribe({
//         pool,
//         relays,
//         filter: _filter,
//         setEvents: _setEvents,
//         onEvent,
//         onEOSE: _onEOSE,
//         onEventPredicate,
//       });
//     },
//     [pool, relays],
//   );
//
//   useEffect(() => {
//     if (initialEvents.length > 0) {
//       setEvents(initialEvents);
//       setLoading(false);
//       return;
//     }
//
//     subscribe({
//       pool,
//       relays,
//       filter,
//       setEvents,
//       onEvent,
//       onEOSE: _onEOSE,
//       onEventPredicate,
//     });
//
//     return () => {
//       // sub.unsub();
//       setLoading(false);
//     };
//   }, [pool, relays]);
//
//   return { loading, loadOlderEvents };
// };
//
// export default useSubEvents;
