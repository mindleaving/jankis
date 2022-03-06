﻿namespace JanKIS.API.Models.MedicalTextEditor
{
    public class DiseaseMedicalTextPart : MedicalTextPart
    {
        public override MedicalTextPartType Type => MedicalTextPartType.Disease;
        public string Icd11Code { get; set; }
    }
}