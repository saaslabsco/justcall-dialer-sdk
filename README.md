# justcall-dialer-sdk

This repository contains the TypeScript code for the JustCall Dialer SDK, which allows integration of JustCall's dialer functionality into web applications.

## Getting Started

To use the JustCall Dialer SDK in your project, follow these steps:

Install the SDK package using npm or yarn:

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

## JustCall Dialer SDK Constructor

To use the JustCall Dialer SDK, you need to create an instance of the `JustCallDialer` class using its constructor. The constructor accepts an object with the following parameters:

- `dialerId`: The id of the HTML element where the JustCall Dialer iframe will be embedded.
- `onLogin`: A callback function triggered when the user logs in. It receives user details and integration settings, if any.
- `onLogout`: A callback function triggered when the user logs out.

Example usage:

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
});
```

## JustCallDialer `on` Methods

The `on` method of the `JustCallDialer` class allows you to listen for events emitted by the JustCall Dialer. It takes two parameters:

- `event`: The type of event you want to listen for. Currently supported events are:

  - `call-ringing`: Triggered when an incoming call starts ringing.
  - `call-answered`: Triggered when an incoming call is answered.
  - `call-ended`: Triggered when a call ends.

- `callback`: A callback function that will be executed when the specified event occurs. The function receives event data as a parameter.

Example usage:

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
```

## JustCallDialer `dialNumber` Method

The `dialNumber` method of the `JustCallDialer` class prepopulates the dialer with the provided phone number. It takes one parameter:

- `number` (string): The phone number to dial. It should be in the format accepted by the JustCall Dialer.

Example usage:

```typescript
dialer.dialNumber("+1234567890");
```

## Event Data Types (Received in Respective Callbacks):

### `LoggedInEventData`

This data object is passed to the `onLogin` callback function when the user logs in. It contains the following properties:

- `logged_in` (boolean): Indicates whether the user is logged in or not.
- `login_numbers` (string[]): An array of phone numbers associated with the user.
- `user_info` (object): An object containing user information, including:
  - `email` (string): The email address of the user.
  - `name` (string): The name of the user.

### `CallRingingEventData`

This data object is passed to the callback function when an incoming call starts ringing. It contains the following properties:

- `direction` (CallDirection): Specifies the direction of the call, either "inbound" or "outbound".
- `from` (string): The phone number of the caller.
- `to` (string): The phone number being called.
- `call_sid` (string): The unique identifier for the call session.

### `CallAnsweredEventData`

This data object is passed to the callback function when an incoming call is answered. It contains the following properties:

- `call_sid` (string): The unique identifier for the call session.
- `direction` (CallDirection): Specifies the direction of the call, either "inbound" or "outbound".
- `answered_status` (string): Indicates the status of the call when answered.

### `CallEndedEventData`

This data object is passed to the callback function when a call ends. It contains the following properties:

- `call_sid` (string): The unique identifier for the call session.
- `direction` (CallDirection): Specifies the direction of the call, either "inbound" or "outbound".
- `duration` (number): The duration of the call session in seconds.

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
