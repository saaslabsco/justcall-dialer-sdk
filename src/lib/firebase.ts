import { initializeApp } from "firebase/app";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../utils/contants";
import { handleError, JustcallDialerErrorCode } from "../utils/errors";

import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import type { Firestore } from "firebase/firestore";

export class Firebase {
  private instance: FirebaseApp;
  private firestore: Firestore;
  private sessionDocSetupStatus: "pending" | "done" = "pending";
  private sessionDoc: ReturnType<typeof doc> | null = null;
  private oauthCommunicationToken: string | null = null;

  constructor({
    config = firebaseConfig,
    name,
  }: {
    config?: FirebaseOptions;
    name?: string;
  }) {
    this.instance = initializeApp(config, name);
    this.firestore = getFirestore(this.instance);
  }

  public setupSessionDoc(token: string) {
    console.log(
      "@justcall/justcall-dialer-sdk: Setting up session doc: ",
      token
    );
    this.oauthCommunicationToken = token;
    this.sessionDoc = doc(
      this.firestore,
      "justcall_dialer_sdk_oauth_trigger",
      this.oauthCommunicationToken
    );
    this.sessionDocSetupStatus = "done";
  }

  public async listenForOauthTrigger({
    onSuccess,
    onError,
  }: {
    onSuccess: Function;
    onError: Function;
  }) {
    if (this.sessionDocSetupStatus !== "done") {
      throw handleError(
        JustcallDialerErrorCode.sdk_internal_error,
        "Session doc not setup"
      );
    }

    onSnapshot(this.sessionDoc!, (doc) => {
      console.log("@justcall/justcall-dialer-sdk: Doc updated: ", doc.data());
      const data = doc.data();
      if (data?.status === "success") {
        if (data.token === this.oauthCommunicationToken) {
          onSuccess();
        }
      } else if (data?.status === "error") {
        if (data.token === this.oauthCommunicationToken) {
          onError();
        }
      }
    });
  }
}
