export class Model {
}

export class User {
    username: string | undefined;
    password: string | undefined;
    status: string | undefined;
    email: string | undefined;
    role: string | undefined;
    token?: string;
    refreshToken?: string;
}

export class Provider {
    name!: string;
    reliability!: number;
    flexibility!: number;
    maturity!: number;
    data_security!: number;
    geo_dispatching!: number;
    price!: number;
    url?: string;
}

export class ProviderAttribut {
    name!: string
    type!: string
    weight!: number
    url?: string
}

export class Rule {
    name: string | undefined;
    criticality: number | undefined;
    complexity: number | undefined;
    availability: number | undefined;
    type: string | undefined;
    contraint: number | undefined;
    url?: string
}

export class Pricing {
    provider: string | undefined;
    category: string | undefined;
    ram: number | undefined;
    cpu: number | undefined;
    price_per_hour: string | undefined;
    price_per_month: string | undefined;
    url?: string;
}

export class Condition {
    name: string
    criteria: string
    condition!: Object
    url: string
}

export class Atom {
    criteria!: string;
    condition!: any[];
    url!: string
}

export class Criteria {
    name: string | undefined;
    vlrate: number | undefined;
    lrate: number | undefined;
    mrate: number | undefined;
    hrate: number | undefined;
    vhrate: number | undefined;
    url!: string
}

export class Project {
    name: string
    architecture: string
    costEstimation: number
    type_application: string
    environment: string
    sla: number
    dependencies: string[]
    flux: string[]
    data_size: number
    cpu: number
    ram: number
    owner: string
    url: string
}

export interface Env {
    value: string
    viewValue: string
}

export interface Rating {
    message: string,
    score: number
}
export interface TypeApp {
    value: string
    viewValue: string
}

export interface Sla {
    value: number
    viewValue: string
}

export interface Archi {
    value: string
    viewValue: string
}

export interface RankingProvider {
    provider: string,
    score: number
}

export interface Contraint {
    value: number
    viewValue: string
}