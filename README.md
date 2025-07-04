# JustCall SDK

This repository contains the TypeScript code for the JustCall Dialer SDK, which allows integration of [JustCall Dialer](https://app.justcall.io/dialer) functionality into web applications.

You need a [JustCall](https://app.justcall.io/) account to be able to use the dialer and the following features.

> **Note**: OAuth login through our SDK has been fixed and is now working properly across all versions of the SDK.

## Installation

Install the SDK package using npm, yarn or pnpm:

```bash
npm install @justcall/justcall-dialer-sdk
```

or

```bash
yarn add @justcall/justcall-dialer-sdk
```

or pnpm

```bash
pnpm add @justcall/justcall-dialer-sdk
```

## Constructor

To use the JustCall Dialer SDK, you need to create an instance of the `JustCallDialer` class using its constructor. The constructor accepts an object with the following parameters:

- `dialerId`: The id of the HTML element where the JustCall Dialer iframe will be embedded.
- `onLogin`: A callback function triggered when the user logs in. It receives user details and integration settings, if any.
- `onLogout`: A callback function triggered when the user logs out.
- `onReady`: A callback function triggered when the JustCall Dialer is ready for use.

Example:

```typescript
import { JustCallDialer } from "@justcall/justcall-dialer-sdk";

const dialer = new JustCallDialer({
  dialerId: "justcall-dialer",
  onLogin: (data) => {
    console.log("Client receiving Logged in data: ", data);
  },
  onLogout: () => {
    console.log("Client receiving Logged out");
  },
  onReady: () => {
    console.log("Client received on ready callback");
  },
});
```

## `on` Methods

The `on` method of the `JustCallDialer` class allows you to listen for events emitted by the JustCall Dialer. It takes two parameters:

- `event`: The type of event you want to listen for. Currently supported events are:

  - `call-ringing`: Triggered when an incoming/outgoing call starts ringing.
  - `call-answered`: Triggered when an incoming/outgoing call is answered.
  - `call-ended`: Triggered when a incoming/outgoing call ends.
  - `sms-received`: Triggered when an SMS is received.

- `callback`: A callback function that will be executed when the specified event occurs. The function receives event data as a parameter.

Example:

```typescript
dialer.on("call-ringing", (data) => {
  console.log("Client receiving call-ringing data: ", data);
});

dialer.on("call-answered", (data) => {
  console.log("Client receiving call-answered data: ", data);
});

dialer.on("call-ended", function (data) {
  console.log("Client receiving call-ended data: ", data);
});

dialer.on("sms-received", function (data) {
  console.log("Client receiving sms-received data: ", data);
});
```

## `unsubscribe(event: JustCallDialerEmittableEvent)` method:

Unsubscribes from a specific event emitted by the JustCall dialer that you are currently listening to.

### Parameters

- `event`: The name of the event that is already subscribed to.

### Example

```typescript
dialer.unsubscribe("call-ringing");
```

## `unsubscribeAll()` method

Unsubscribes from all events that you are currently listening to, emitted by the JustCall dialer.

### Example

```typescript
dialer.unsubscribeAll();
```

## `ready` method

The `ready` method of the `JustCallDialer` class ensures that the JustCall Dialer is ready for use before executing specific actions. It returns a Promise that resolves when the dialer is ready.

```typescript
// Ensure the dialer is ready before using isLoggedIn and dialNumber methods
await dialer.ready();
const isLoggedIn = await dialer.isLoggedIn(); // returns true or false
dialer.dialNumber("+1234567890");
```

## `isLoggedIn` Method

The `isLoggedIn` method of the `JustCallDialer` class checks whether the user is logged in to JustCall Dialer. It returns a Promise that resolves to a boolean value indicating the login status.

Note: Ensure that the dialer is in a ready state before calling this method.

Example:

```typescript
await dialer.ready();
const isLoggedIn = await dialer.isLoggedIn(); // returns true or false
```

## `dialNumber` Method

The `dialNumber` method of the `JustCallDialer` class prepopulates the dialer with the provided phone number. It takes one parameter:

- `number` (string): The phone number to dial. It should be in the format accepted by the JustCall Dialer.

Note: Ensure that the dialer is in a ready state before calling this method.

Example:

```typescript
await dialer.ready();
dialer.dialNumber("+1234567890");
```

## `destroy` Method

The `destroy` method of the `JustCallDialer` class is used to clean up and release resources when the JustCall Dialer instance is no longer needed. It performs the following actions:

- Unsubscribes from all events that the instance is currently listening to.
- Removes the JustCall Dialer iframe from the DOM.
- Resets internal state variables and event listeners.

Example:

```typescript
dialer.destroy();
```

## Event Data Types (Received in Respective Callbacks):

### `LoggedInEventData`

This data object is passed to the `onLogin` callback function when the user logs in. It contains the following properties:

- `logged_in` (boolean): Indicates whether the user is logged in or not.
- `login_numbers` (string[]): An array of phone numbers associated with the user.
- `user_info` (object): An object containing user information, including:
  - `email` (string): The email address of the user.
  - `name` (string): The name of the user.

```json
{
  "logged_in": true,
  "login_numbers": ["+1234567890", "+1987654321"],
  "user_info": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### `CallRingingEventData`

This data object is passed to the callback function when an incoming call starts ringing. It contains the following properties:

- `direction` (CallDirection): Specifies the direction of the call, either "inbound" or "outbound".
- `from` (string): The phone number of the caller.
- `to` (string): The phone number being called.
- `call_sid` (string): The unique identifier for the call session.

```json
{
  "direction": "inbound",
  "from": "+1234567890",
  "to": "+1987654321",
  "call_sid": "abcdefgh123456"
}
```

### `CallAnsweredEventData`

This data object is passed to the callback function when an incoming call is answered. It contains the following properties:

- `call_sid` (string): The unique identifier for the call session.
- `direction` (CallDirection): Specifies the direction of the call, either "inbound" or "outbound".
- `answered_status` (string): Indicates the status of the call when answered.

```json
{
  "call_sid": "CAdemocallsid21345",
  "direction": "inbound",
  "answered_status": "answered"
}
```

### `CallEndedEventData`

This data object is passed to the callback function when a call ends. It contains the following properties:

- `call_sid` (string): The unique identifier for the call session.
- `direction` (CallDirection): Specifies the direction of the call, either "inbound" or "outbound".
- `duration` (number): The duration of the call session in seconds.

```json
{
  "call_sid": "CAdemocallsid21345",
  "direction": "inbound",
  "duration": 120
}
```

### `SMSReceivedEventData`

This data object is passed to the callback function when an SMS is received. It contains the following properties:

- `message_sid` (string): The unique identifier for the SMS session.
- `from` (string): The phone number of the sender.
- `to` (string): The phone number of the receiver.
- `body` (string): The body of the SMS.
- `received_at` (string): The date and time when the SMS was received.

```json
{
  "message_sid": "",
  "from": "",
  "to": "",
  "body": "",
  "received_at": ""
}
```

## Justcall Dialer Error Codes

The `JustcallDialerErrorCode` enum provides error codes for handling various scenarios in the JustCall Dialer SDK.

### Error Codes:

- `invalid_event_name`: This error occurs when an invalid event name is provided.
- `no_event_name`: This error occurs when no event name is provided.
- `dialer_not_ready`: This error occurs when the JustCall Dialer is not ready for use.
- `not_subscribed_to_event`: This error occurs when attempting to unsubscribe from an event that you were not subscribed to in the first place.
- `no_dialer_id`: This error occurs when no dialer ID is provided.
- `dialer_id_not_found`: This error occurs when the specified dialer ID is not found.
- `browser_environment_required`: This error occurs when the JustCall Dialer SDK is run in non-browser environments.
- `unknown_error`: This error occurs when an unknown error is encountered during the operation of the JustCall Dialer SDK.

These error codes are useful for identifying and handling different error scenarios in the JustCall Dialer SDK.

## Authorizations for `<iframe>`

Please note that @justcall/justcall-dialer-sdk will produce an iframe with the following permissions granted:

```html
<iframe
  allow="microphone; autoplay; clipboard-read; clipboard-write; hid"
  src="https://app.justcall.io/app/macapp/dialer_events"
  style="width='365px' height='610px'"
>
</iframe>
```

## Contribution

We welcome contributions from the community to improve the JustCall Dialer SDK. To contribute, follow these steps:

1. Make sure you have [PNPM](https://pnpm.io/) installed on your machine.

2. Run the following command to create a changeset and generate a changelog:

   ```bash
   pnpm changeset
   ```

3. This command will prompt you to select the type of update you're pushing (patch, minor, or major), and provide a description of the changes made.

4. After creating the changeset and changelog, commit your changes using Git:

   ```bash
   git add .
   git commit -m "Your commit message"
   ```

5. Push your changes to your fork of the repository and create PR.

## Code coverage

Find our code coverage report here: https://saaslabsco.github.io/justcall-dialer-sdk/coverage/
