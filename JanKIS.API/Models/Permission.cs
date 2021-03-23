namespace JanKIS.API.Models
{
    public enum Permission
    {
        // Employee management
        ListEmployees,
        ViewEmployeeDetails,
        CreateEmployees,
        DeleteEmployees,
        ChangeEmployeePermissions,
        ResetPasswords,

        // Bed allocation
        ViewAllBedStates,
        ViewWardBedStates,

        // Service provider
        ManageDepartmentServices,

        ManageDepartments
    }
}
