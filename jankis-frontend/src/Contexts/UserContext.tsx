import React, { createContext } from "react";
import { Models } from "../types/models";

const UserContext = createContext<Models.PersonWithLogin | undefined>(undefined);
export const UserProvider = UserContext.Provider;
export default UserContext;
