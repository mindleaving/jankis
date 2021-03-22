﻿using System;

namespace JanKIS.API.Helpers
{
    public static class SearchTermSplitter
    {
        public static string[] SplitAndToLower(string searchText)
        {
            return searchText.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        }
    }
}
