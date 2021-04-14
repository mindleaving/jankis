import React, { createContext } from "react";
import { ViewModels } from "../types/viewModels";

const UserContext = createContext<ViewModels.LoggedInUserViewModel | undefined>(undefined);
export const UserProvider = UserContext.Provider;
export default UserContext;
