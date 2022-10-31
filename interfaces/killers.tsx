export interface Killers {
  name:                       string;
  alias:                      boolean | string;
  "Served in the military?":  boolean | null | string;
  "Marital status":           boolean | null | string;
  "Spend time in jail? ":     boolean | null | string;
  "Spend time in prison? ":   boolean | null | string;
  "Number of victims":        number | null;
  Weapon:                     boolean | null | string;
  IQ:                         number | null;
  Location:                   string;
  Brutality:                  number;
  "Childhood Trauma":         number;
  "Psychological Perversion": number;
  "Killing Severity":         number;
  stereotype:                 number;
  stereotype_pos:             number[];
}

export default class Props {
  data: [Killers] // json with killers data
  targets: []  // datapoints of interest
}
