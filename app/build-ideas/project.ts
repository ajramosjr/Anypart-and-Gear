export const planUrl = "https://kartfab.com/go-kart-plans";
export const drawingUrl = "https://kartfab.com/wp-content/uploads/2016/10/Free-Go-Kart-Plans.pdf";
const root = "https://kartfab.com/go-kart-plans/";
export const materials = [
  ['Square tubing', '1 × 1 inch, 11-gauge mild steel; five 10-foot lengths'],
  ['Bracket plate', '12 × 12 × 3/16 inch mild steel'],
  ['Floor sheet', '26 × 20 inch, 16-gauge steel'],
  ['Steering-shaft tube', '18 inches of 3/4-inch OD, 11-gauge tubing'],
  ['Other stock', '3/8-inch and 1/4-inch round bar, angle and spacers specified in the drawings'],
  ['Purchased running gear', 'Matching fixed-axle wheel assemblies, spindles, tie rods, steering wheel, seat and sliders'],
  ['Drive and controls', 'Compatible horizontal-shaft gas engine, clutch, chain, sprocket, brake drum and band, pedals, return springs, throttle cable and kill switch'],
  ['Hardware', 'Use the complete fastener and spacer schedule on PDF pages 5–6; verify against the actual components before buying'],
];
export const stages = [
  { id: 'cut', title: 'Mark and cut the steel', picture: 'cut', pages: 'PDF pages 7–9', source: root+'4-ways-cut-steel-go-kart-frame', steps: [
    'Open the dimensioned drawings. Make a cut sheet with a separate row for each tube: part name, quantity, finished length and end angles. Keep square-cut and angled pieces separate.',
    'Mark the first tube with a square and scribe. Mark the waste side of the line so the saw kerf does not shorten the finished piece. Clamp it securely before cutting.',
    'Cut one piece, deburr it and check the finished length. Use that verified piece to check its matching partner; do not measure each new piece from an unverified offcut.',
    'Mark bracket outlines and hole centers on plate using the drawings. Center-punch and drill with the plate clamped, then cut out and deburr the brackets. Label every piece before laying out the frame.'
  ], check: 'All lengths, end angles and hole locations agree with the drawing. Never measure off the illustration below.' },
  { id: 'frame', title: 'Square, tack and weld the frame', picture: 'frame', pages: 'PDF pages 8–9', source: root+'go-kart-frame', steps: [
    'Arrange the base tubes on a level, noncombustible welding table in the positions shown by the base-frame drawing. Clamp them so the top faces remain in one plane.',
    'Check corners with a square. Compare diagonal measurements between corresponding corners of rectangular sections; adjust the clamps until they match.',
    'Place small tack welds at the joints. Recheck the dimensions, diagonals and flatness before adding more weld. Correct a shifted joint now rather than forcing the frame straight later.',
    'Complete the structural welds in a balanced sequence, checking for distortion as you go. Build and attach the front bumper to its drawing, including the pedal pivot holes. Do not grind structural welds flat for appearance.'
  ], check: 'Frame sits flat, matches the drawing and has welds assessed by a competent welder before load-bearing use.' },
  { id: 'axle', title: 'Fabricate and locate the rear axle', picture: 'axle', pages: 'PDF page 10', source: root+'homemade-go-kart-axle', steps: [
    'Use the fixed-axle drawing for the crossmember and stub-axle dimensions. This design has stationary wheel-support stubs; it is not a rotating live-axle kart.',
    'Fixture the specified stub components straight and coaxial at the crossmember ends. Keep weld spatter off threads and bearing surfaces. Tack, verify alignment, then complete the specified joints.',
    'Mark the axle location from the same rear-frame reference edge used in the drawing. Clamp the assembly beneath the frame and measure its position at both sides before welding.',
    'Trial-fit the wheel assemblies and specified spacers. Rotate the wheels by hand and inspect clearance and alignment. Remove bearings, tires and other heat-sensitive parts before further nearby welding.'
  ], check: 'Axle position and wheel retention match the plan. Wheels turn freely without binding or unintended sideways movement.' },
  { id: 'floor', title: 'Fit the floor and seat supports', picture: 'floor', pages: 'PDF pages 11, 13–14', source: root+'go-kart-floor-pan', extraSource: root+'go-kart-seats-how-to-make-vs-buy-cheap', steps: [
    'Deburr the floor sheet. Hold it under the base frame in the plan position and mark the attachment and seat-slider hole locations.',
    'Check the actual slider bolt spacing before fabricating its support plates. An 8-inch slider pattern and an 11-inch pattern need different supports; do not force the bolts into mismatched holes.',
    'Fabricate the seat frame to the seat drawing. Trial-bolt the seat, sliders and supports together, then check that both sliders latch and that the driver can reach the controls.',
    'Remove the seat and sliders before hot work. Attach the supports and floor using the plan arrangement, keeping the sheet flat and preventing weld distortion. Remove sharp edges and drilling debris.'
  ], check: 'Seat supports line up with the actual sliders; moving sliders cannot strike hardware or the floor.' },
  { id: 'steering', title: 'Build the steering assembly', picture: 'steering', pages: 'PDF pages 15–17', source: root+'go-kart-steering', steps: [
    'Fabricate the steering hoop, shaft supports, shaft and steering-wheel hub to the drawing. Position the supports with the shaft installed so their axes line up; remove heat-sensitive parts before welding.',
    'Position the left and right spindle brackets on the front crossmember exactly as drawn. Clamp and verify orientation before completing the welds.',
    'Install the spindles with the specified pivots and retention hardware. Fit the wheel, shaft and tie rods; maintain the specified thread engagement at each rod end.',
    'Center the steering and adjust the rods to the source alignment procedure. Move slowly from lock to lock while checking the tires, tie rods, pedals and frame for contact or binding. Secure the adjuster locknuts.'
  ], check: 'No binding, loose pivots, tire contact or linkage over-centering anywhere in the steering travel.' },
  { id: 'brakes', title: 'Install the brake pedal, band and rod', picture: 'brakes', pages: 'PDF pages 18–21', source: root+'go-kart-brake-band', steps: [
    'Install the drive wheel with its brake drum, then position the correct band around the drum. Use this actual assembly to establish the anchor location shown in the source drawing.',
    'Fit the brake pedal, return spring and pedal stops. Check full pedal travel against the steering linkage before fixing the stops permanently.',
    'Form the brake rod along the frame. Install its guide and connect the rod between the pedal and brake band using the specified clevis and pins. Tack fabricated mounts only after cycling the linkage.',
    'Remove sensitive components for final welding, then reassemble with the required retained pins. Adjust the linkage so the brake releases without drag and applies firmly before the pedal reaches its stop.'
  ], check: 'With the engine off, pushing the kart and applying the pedal stops it; releasing the pedal releases the brake. This is only an initial check, not a full braking validation.' },
  { id: 'engine', title: 'Align the engine, clutch and chain', picture: 'engine', pages: 'PDF page 12', source: root+'go-kart-engine-mount', steps: [
    'Keep fuel out of the engine and disconnect the spark plug lead. Trial-fit the seat and drive wheel so their clearances determine the engine-mount location.',
    'Install the compatible clutch on the engine shaft with its specified key, spacers and retaining hardware. Bolt the engine to the slotted mounting plate, preserving room for chain adjustment.',
    'Use a straightedge to align the clutch sprocket with the drive-wheel sprocket. Fit the correct chain pitch and length. Confirm shaft parallelism, seat clearance and adjustment travel before marking the plate position.',
    'Tack the plate, recheck alignment, then remove the engine, fuel system and heat-sensitive components for final welding. Reinstall and set chain slack and fastener torque to the component manufacturers’ requirements. Fit a secure clutch and chain guard before powered testing.'
  ], check: 'Mount is fully welded before any ride. Drive rotates smoothly by hand; chain cannot touch the frame or seat.' },
  { id: 'throttle', title: 'Connect the throttle and stop switch', picture: 'throttle', pages: 'PDF page 22; engine manual for linkage and wiring', source: root+'go-kart-throttle-cable', steps: [
    'Install the throttle pedal and return spring. Set pedal stops so the pedal cannot hit a tie rod or pull the cable beyond the engine linkage’s available travel.',
    'Install the cable-housing tab at the plan position. Attach the housing and connect the cable eyelet to the pedal with its specified spacer so the eyelet pivots freely.',
    'Route the cable with broad bends, clear of the chain and exhaust. Clamp the housing at the engine and attach the inner cable using that engine’s remote-throttle instructions. Retain the stock governor and factory safety systems.',
    'Cycle and release the pedal repeatedly with the engine off. The engine linkage must return to idle each time. Mount an accessible kill switch and connect it according to the engine manufacturer’s ignition-stop diagram; do not guess wire colors or bypass the low-oil protection.'
  ], check: 'Throttle returns reliably from every position, and wiring is secured away from moving or hot parts.' },
  { id: 'finish', title: 'Finish and reassemble', picture: 'finished', pages: 'PDF pages 23–25', source: root+'go-kart-assembly-instructions', steps: [
    'Complete all fabrication and a full dry assembly first. Label and photograph spacer order and hardware positions before disassembly for finishing.',
    'Remove the engine, wheels, controls and seat. Clean and prepare the steel; keep paint off bearings, friction surfaces, threads and electrical ground contact points. Allow coatings to cure.',
    'Reassemble using the drawing and the actual component instructions. Use specified locking hardware and torque values, and install new cotter pins where required. Never substitute a generic torque number for a component specification.',
    'Recheck steering alignment, bearing freedom, wheel retention, brake operation, chain alignment and throttle return. Secure guards and route the stop-switch wiring. Bolt the seat assembly down and confirm the slider latches.'
  ], check: 'No missing retention pins, loose fasteners, exposed drive parts, fuel leaks or unsecured cables.' },
  { id: 'test', title: 'Inspect, then make the first controlled test', picture: 'test', pages: 'Source safety instructions and engine/component manuals', source: planUrl, steps: [
    'Have a competent fabricator inspect the chassis welds and critical attachments. Have an experienced kart builder inspect steering, brakes, drive retention and guards. Resolve every defect before starting.',
    'With the engine off on level ground, push the kart and test steering and braking. Check pedal reach and access to the kill switch while seated. Keep bystanders clear.',
    'Add the specified engine oil and fuel outdoors, away from ignition sources. Start only using the engine manufacturer’s procedure. Confirm idle, throttle return and kill-switch operation before any riding test. Shut down immediately if the kart creeps or controls behave unpredictably.',
    'Use a helmet, eye protection and suitable clothing. Begin at walking pace on a flat, clear, closed private area with permission; test stopping before increasing speed. Stop and reinspect fasteners, welds and drive alignment after the initial test. Never use public roads.'
  ], check: 'Stop testing for weak brakes, sticking throttle, steering trouble, vibration, fuel leakage or any loose component.' },
];
