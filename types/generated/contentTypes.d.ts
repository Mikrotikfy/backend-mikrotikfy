import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    cities: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::city.city'
    >;
    tickets: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::ticket.ticket'
    >;
    ticketdetails: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::ticketdetail.ticketdetail'
    >;
    clienttypes: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::clienttype.clienttype'
    >;
    materialhistories: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::materialhistory.materialhistory'
    >;
    menus: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::menu.menu'
    >;
    staticips: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::staticip.staticip'
    >;
    debtmovements: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::debtmovement.debtmovement'
    >;
    offermovements: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::offermovement.offermovement'
    >;
    ticketstechnician: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::ticket.ticket'
    >;
    telegramchatid: Attribute.String;
    phone: Attribute.String;
    invoice_movements: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::invoice-movement.invoice-movement'
    >;
    preferredcity: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'api::city.city'
    >;
    legal_notes: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::legal-note.legal-note'
    >;
    preferredclienttype: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'api::clienttype.clienttype'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAddressAddress extends Schema.CollectionType {
  collectionName: 'addresses';
  info: {
    singularName: 'address';
    pluralName: 'addresses';
    displayName: 'address';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    address: Attribute.String;
    neighborhood: Attribute.Relation<
      'api::address.address',
      'manyToOne',
      'api::neighborhood.neighborhood'
    >;
    client: Attribute.Relation<
      'api::address.address',
      'manyToOne',
      'api::client.client'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::address.address',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::address.address',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBillingperiodBillingperiod extends Schema.CollectionType {
  collectionName: 'billingperiods';
  info: {
    singularName: 'billingperiod';
    pluralName: 'billingperiods';
    displayName: 'billingperiod';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    city: Attribute.Relation<
      'api::billingperiod.billingperiod',
      'manyToOne',
      'api::city.city'
    >;
    month: Attribute.Integer;
    year: Attribute.Integer;
    clienttype: Attribute.Relation<
      'api::billingperiod.billingperiod',
      'manyToOne',
      'api::clienttype.clienttype'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::billingperiod.billingperiod',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::billingperiod.billingperiod',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCityCity extends Schema.CollectionType {
  collectionName: 'cities';
  info: {
    singularName: 'city';
    pluralName: 'cities';
    displayName: 'city';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    color: Attribute.String;
    active: Attribute.String;
    count: Attribute.String;
    countActive: Attribute.String;
    countDisable: Attribute.String;
    countRetired: Attribute.String;
    clients: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'api::client.client'
    >;
    tickets: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'api::ticket.ticket'
    >;
    telegrambots: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'api::telegrambot.telegrambot'
    >;
    users: Attribute.Relation<
      'api::city.city',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    mikrotiks: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'api::mikrotik.mikrotik'
    >;
    neighborhoods: Attribute.Relation<
      'api::city.city',
      'manyToMany',
      'api::neighborhood.neighborhood'
    >;
    naps: Attribute.Relation<'api::city.city', 'oneToMany', 'api::nap.nap'>;
    material: Attribute.Relation<
      'api::city.city',
      'oneToOne',
      'api::material.material'
    >;
    staticips: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'api::staticip.staticip'
    >;
    vlans: Attribute.Relation<'api::city.city', 'oneToMany', 'api::vlan.vlan'>;
    billingperiods: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'api::billingperiod.billingperiod'
    >;
    debtmovements: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'api::debtmovement.debtmovement'
    >;
    user_preferred_cities: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    requiresphone: Attribute.Boolean & Attribute.DefaultTo<false>;
    services: Attribute.Relation<
      'api::city.city',
      'oneToMany',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::city.city', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::city.city', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiClientClient extends Schema.CollectionType {
  collectionName: 'clients';
  info: {
    singularName: 'client';
    pluralName: 'clients';
    displayName: 'client';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    active: Attribute.Boolean & Attribute.DefaultTo<false>;
    indebt: Attribute.Boolean & Attribute.DefaultTo<false>;
    code: Attribute.String;
    dni: Attribute.String;
    name: Attribute.String;
    address: Attribute.String;
    wifi_ssid: Attribute.String;
    wifi_password: Attribute.String;
    newModel: Attribute.Integer;
    phone: Attribute.String;
    email: Attribute.String;
    ipmodel: Attribute.Integer & Attribute.DefaultTo<0>;
    balance: Attribute.Integer & Attribute.DefaultTo<0>;
    billingmonth: Attribute.Integer;
    billingyear: Attribute.Integer;
    stratum: Attribute.Integer;
    opticalpower: Attribute.Integer;
    signed: Attribute.Boolean & Attribute.DefaultTo<false>;
    signature: Attribute.String;
    update_password: Attribute.Boolean;
    corporate: Attribute.Boolean;
    city: Attribute.Relation<
      'api::client.client',
      'manyToOne',
      'api::city.city'
    >;
    clienttype: Attribute.Relation<
      'api::client.client',
      'manyToOne',
      'api::clienttype.clienttype'
    >;
    addresses: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::address.address'
    >;
    services: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::service.service'
    >;
    invoices: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::invoice.invoice'
    >;
    legal_notes: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::legal-note.legal-note'
    >;
    tickets: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::ticket.ticket'
    >;
    mac_addresses: Attribute.Relation<
      'api::client.client',
      'manyToMany',
      'api::device.device'
    >;
    naps: Attribute.Relation<
      'api::client.client',
      'manyToMany',
      'api::nap.nap'
    >;
    passwordchanges: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::passwordchange.passwordchange'
    >;
    plan: Attribute.Relation<
      'api::client.client',
      'manyToOne',
      'api::plan.plan'
    >;
    neighborhood: Attribute.Relation<
      'api::client.client',
      'manyToOne',
      'api::neighborhood.neighborhood'
    >;
    technology: Attribute.Relation<
      'api::client.client',
      'manyToOne',
      'api::technology.technology'
    >;
    operator: Attribute.Relation<
      'api::client.client',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    staticip: Attribute.Relation<
      'api::client.client',
      'oneToOne',
      'api::staticip.staticip'
    >;
    vlan: Attribute.Relation<
      'api::client.client',
      'manyToOne',
      'api::vlan.vlan'
    >;
    offer: Attribute.Relation<
      'api::client.client',
      'manyToOne',
      'api::offer.offer'
    >;
    debtmovements: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::debtmovement.debtmovement'
    >;
    offermovements: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::offermovement.offermovement'
    >;
    monthlybills: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::monthlybill.monthlybill'
    >;
    tvspec: Attribute.Relation<
      'api::client.client',
      'oneToOne',
      'api::tvspec.tvspec'
    >;
    pppoe_events: Attribute.Relation<
      'api::client.client',
      'oneToMany',
      'api::pppoe-event.pppoe-event'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::client.client',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::client.client',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClienttypeClienttype extends Schema.CollectionType {
  collectionName: 'clienttypes';
  info: {
    singularName: 'clienttype';
    pluralName: 'clienttypes';
    displayName: 'clienttype';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    clients: Attribute.Relation<
      'api::clienttype.clienttype',
      'oneToMany',
      'api::client.client'
    >;
    icon: Attribute.String;
    tickets: Attribute.Relation<
      'api::clienttype.clienttype',
      'oneToMany',
      'api::ticket.ticket'
    >;
    users: Attribute.Relation<
      'api::clienttype.clienttype',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    tickettypes: Attribute.Relation<
      'api::clienttype.clienttype',
      'manyToMany',
      'api::tickettype.tickettype'
    >;
    billingperiods: Attribute.Relation<
      'api::clienttype.clienttype',
      'oneToMany',
      'api::billingperiod.billingperiod'
    >;
    services: Attribute.Relation<
      'api::clienttype.clienttype',
      'oneToMany',
      'api::service.service'
    >;
    user_preferred_clienttype: Attribute.Relation<
      'api::clienttype.clienttype',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::clienttype.clienttype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::clienttype.clienttype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiComponentComponent extends Schema.CollectionType {
  collectionName: 'components';
  info: {
    singularName: 'component';
    pluralName: 'components';
    displayName: 'component';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::component.component',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::component.component',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDebtmovementDebtmovement extends Schema.CollectionType {
  collectionName: 'debtmovements';
  info: {
    singularName: 'debtmovement';
    pluralName: 'debtmovements';
    displayName: 'debtmovement';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    offer: Attribute.Relation<
      'api::debtmovement.debtmovement',
      'manyToOne',
      'api::offer.offer'
    >;
    client: Attribute.Relation<
      'api::debtmovement.debtmovement',
      'manyToOne',
      'api::client.client'
    >;
    isindebt: Attribute.Boolean & Attribute.DefaultTo<false>;
    isretired: Attribute.Boolean & Attribute.DefaultTo<false>;
    technician: Attribute.Relation<
      'api::debtmovement.debtmovement',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    comment: Attribute.String;
    city: Attribute.Relation<
      'api::debtmovement.debtmovement',
      'manyToOne',
      'api::city.city'
    >;
    service: Attribute.Relation<
      'api::debtmovement.debtmovement',
      'manyToOne',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::debtmovement.debtmovement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::debtmovement.debtmovement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDeviceDevice extends Schema.CollectionType {
  collectionName: 'devices';
  info: {
    singularName: 'device';
    pluralName: 'devices';
    displayName: 'device';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    mac_address: Attribute.String;
    clients: Attribute.Relation<
      'api::device.device',
      'manyToMany',
      'api::client.client'
    >;
    devicebrand: Attribute.Relation<
      'api::device.device',
      'manyToOne',
      'api::devicebrand.devicebrand'
    >;
    details: Attribute.String;
    staticip: Attribute.Relation<
      'api::device.device',
      'oneToOne',
      'api::staticip.staticip'
    >;
    services: Attribute.Relation<
      'api::device.device',
      'manyToMany',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::device.device',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::device.device',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDevicebrandDevicebrand extends Schema.CollectionType {
  collectionName: 'devicebrands';
  info: {
    singularName: 'devicebrand';
    pluralName: 'devicebrands';
    displayName: 'devicebrand';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    devices: Attribute.Relation<
      'api::devicebrand.devicebrand',
      'oneToMany',
      'api::device.device'
    >;
    devicebrandparts: Attribute.Relation<
      'api::devicebrand.devicebrand',
      'oneToMany',
      'api::devicebrandpart.devicebrandpart'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::devicebrand.devicebrand',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::devicebrand.devicebrand',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDevicebrandpartDevicebrandpart
  extends Schema.CollectionType {
  collectionName: 'devicebrandparts';
  info: {
    singularName: 'devicebrandpart';
    pluralName: 'devicebrandparts';
    displayName: 'devicebrandpart';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    mac_part: Attribute.String;
    devicebrand: Attribute.Relation<
      'api::devicebrandpart.devicebrandpart',
      'manyToOne',
      'api::devicebrand.devicebrand'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::devicebrandpart.devicebrandpart',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::devicebrandpart.devicebrandpart',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvoiceInvoice extends Schema.CollectionType {
  collectionName: 'invoices';
  info: {
    singularName: 'invoice';
    pluralName: 'invoices';
    displayName: 'invoice';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    balance: Attribute.Integer;
    month: Attribute.Integer;
    year: Attribute.Integer;
    type: Attribute.String;
    offer: Attribute.Relation<
      'api::invoice.invoice',
      'manyToOne',
      'api::offer.offer'
    >;
    concept: Attribute.String;
    payed: Attribute.Boolean;
    partial: Attribute.Boolean;
    indebt: Attribute.Boolean;
    client: Attribute.Relation<
      'api::invoice.invoice',
      'manyToOne',
      'api::client.client'
    >;
    invoice_movements: Attribute.Relation<
      'api::invoice.invoice',
      'oneToMany',
      'api::invoice-movement.invoice-movement'
    >;
    invoice_type: Attribute.Relation<
      'api::invoice.invoice',
      'manyToOne',
      'api::invoice-type.invoice-type'
    >;
    value: Attribute.Integer;
    details: Attribute.String;
    legal_notes: Attribute.Relation<
      'api::invoice.invoice',
      'manyToMany',
      'api::legal-note.legal-note'
    >;
    service: Attribute.Relation<
      'api::invoice.invoice',
      'manyToOne',
      'api::service.service'
    >;
    cancelled: Attribute.Boolean;
    cancelreason: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvoiceMovementInvoiceMovement
  extends Schema.CollectionType {
  collectionName: 'invoice_movements';
  info: {
    singularName: 'invoice-movement';
    pluralName: 'invoice-movements';
    displayName: 'invoice-movement';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    amount: Attribute.Integer;
    details: Attribute.String;
    invoice: Attribute.Relation<
      'api::invoice-movement.invoice-movement',
      'manyToOne',
      'api::invoice.invoice'
    >;
    biller: Attribute.Relation<
      'api::invoice-movement.invoice-movement',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    legal_note: Attribute.Relation<
      'api::invoice-movement.invoice-movement',
      'manyToOne',
      'api::legal-note.legal-note'
    >;
    concept: Attribute.String;
    type: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invoice-movement.invoice-movement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invoice-movement.invoice-movement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvoiceTypeInvoiceType extends Schema.CollectionType {
  collectionName: 'invoice_types';
  info: {
    singularName: 'invoice-type';
    pluralName: 'invoice-types';
    displayName: 'invoice-type';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    invoices: Attribute.Relation<
      'api::invoice-type.invoice-type',
      'oneToMany',
      'api::invoice.invoice'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invoice-type.invoice-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invoice-type.invoice-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLegalNoteLegalNote extends Schema.CollectionType {
  collectionName: 'legal_notes';
  info: {
    singularName: 'legal-note';
    pluralName: 'legal-notes';
    displayName: 'legal-note';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    debit: Attribute.Integer;
    biller: Attribute.Relation<
      'api::legal-note.legal-note',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    invoices: Attribute.Relation<
      'api::legal-note.legal-note',
      'manyToMany',
      'api::invoice.invoice'
    >;
    client: Attribute.Relation<
      'api::legal-note.legal-note',
      'manyToOne',
      'api::client.client'
    >;
    credit: Attribute.Integer;
    concept: Attribute.String;
    invoice_movements: Attribute.Relation<
      'api::legal-note.legal-note',
      'oneToMany',
      'api::invoice-movement.invoice-movement'
    >;
    city: Attribute.String;
    clienttype: Attribute.String;
    service: Attribute.Relation<
      'api::legal-note.legal-note',
      'manyToOne',
      'api::service.service'
    >;
    cancelled: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::legal-note.legal-note',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::legal-note.legal-note',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaterialMaterial extends Schema.CollectionType {
  collectionName: 'materials';
  info: {
    singularName: 'material';
    pluralName: 'materials';
    displayName: 'material';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    materialhistories: Attribute.Relation<
      'api::material.material',
      'oneToMany',
      'api::materialhistory.materialhistory'
    >;
    city: Attribute.Relation<
      'api::material.material',
      'oneToOne',
      'api::city.city'
    >;
    materialquantities: Attribute.Relation<
      'api::material.material',
      'oneToMany',
      'api::materialquantity.materialquantity'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::material.material',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::material.material',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaterialhistoryMaterialhistory
  extends Schema.CollectionType {
  collectionName: 'materialhistories';
  info: {
    singularName: 'materialhistory';
    pluralName: 'materialhistories';
    displayName: 'materialhistory';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    quantity: Attribute.Integer;
    material: Attribute.Relation<
      'api::materialhistory.materialhistory',
      'manyToOne',
      'api::material.material'
    >;
    materialhistorytype: Attribute.Relation<
      'api::materialhistory.materialhistory',
      'manyToOne',
      'api::materialhistorytype.materialhistorytype'
    >;
    operator: Attribute.Relation<
      'api::materialhistory.materialhistory',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    technician: Attribute.Relation<
      'api::materialhistory.materialhistory',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    description: Attribute.Text;
    materialtype: Attribute.Relation<
      'api::materialhistory.materialhistory',
      'oneToOne',
      'api::materialtype.materialtype'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::materialhistory.materialhistory',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::materialhistory.materialhistory',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaterialhistorytypeMaterialhistorytype
  extends Schema.CollectionType {
  collectionName: 'materialhistorytypes';
  info: {
    singularName: 'materialhistorytype';
    pluralName: 'materialhistorytypes';
    displayName: 'materialhistorytype';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    materialhistories: Attribute.Relation<
      'api::materialhistorytype.materialhistorytype',
      'oneToMany',
      'api::materialhistory.materialhistory'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::materialhistorytype.materialhistorytype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::materialhistorytype.materialhistorytype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaterialquantityMaterialquantity
  extends Schema.CollectionType {
  collectionName: 'materialquantities';
  info: {
    singularName: 'materialquantity';
    pluralName: 'materialquantities';
    displayName: 'materialquantity';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    quantity: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }> &
      Attribute.DefaultTo<0>;
    material: Attribute.Relation<
      'api::materialquantity.materialquantity',
      'manyToOne',
      'api::material.material'
    >;
    materialtype: Attribute.Relation<
      'api::materialquantity.materialquantity',
      'manyToOne',
      'api::materialtype.materialtype'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::materialquantity.materialquantity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::materialquantity.materialquantity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaterialtypeMaterialtype extends Schema.CollectionType {
  collectionName: 'materialtypes';
  info: {
    singularName: 'materialtype';
    pluralName: 'materialtypes';
    displayName: 'materialtype';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    materialquantities: Attribute.Relation<
      'api::materialtype.materialtype',
      'oneToMany',
      'api::materialquantity.materialquantity'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::materialtype.materialtype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::materialtype.materialtype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMenuMenu extends Schema.CollectionType {
  collectionName: 'menus';
  info: {
    singularName: 'menu';
    pluralName: 'menus';
    displayName: 'menu';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    icon: Attribute.String;
    url: Attribute.String;
    users: Attribute.Relation<
      'api::menu.menu',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    priority: Attribute.Integer & Attribute.DefaultTo<-1>;
    alert: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::menu.menu', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::menu.menu', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiMikrotikMikrotik extends Schema.CollectionType {
  collectionName: 'mikrotiks';
  info: {
    singularName: 'mikrotik';
    pluralName: 'mikrotiks';
    displayName: 'mikrotik';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    ip: Attribute.String;
    uptime: Attribute.String;
    cpu: Attribute.String;
    memory: Attribute.String;
    version: Attribute.String;
    buildtime: Attribute.String;
    factorysoftware: Attribute.String;
    totalmemory: Attribute.String;
    cpucount: Attribute.String;
    cpufrequency: Attribute.String;
    freehddspace: Attribute.String;
    totalhddspace: Attribute.String;
    architecturename: Attribute.String;
    platform: Attribute.String;
    boardname: Attribute.String;
    city: Attribute.Relation<
      'api::mikrotik.mikrotik',
      'manyToOne',
      'api::city.city'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::mikrotik.mikrotik',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::mikrotik.mikrotik',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMonthlybillMonthlybill extends Schema.CollectionType {
  collectionName: 'monthlybills';
  info: {
    singularName: 'monthlybill';
    pluralName: 'monthlybills';
    displayName: 'monthlybill';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    month: Attribute.Integer;
    year: Attribute.Integer;
    path: Attribute.String;
    client: Attribute.Relation<
      'api::monthlybill.monthlybill',
      'manyToOne',
      'api::client.client'
    >;
    success: Attribute.Boolean;
    type: Attribute.String;
    resend: Attribute.Integer;
    resend_at: Attribute.String;
    service: Attribute.Relation<
      'api::monthlybill.monthlybill',
      'manyToOne',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::monthlybill.monthlybill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::monthlybill.monthlybill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNapNap extends Schema.CollectionType {
  collectionName: 'naps';
  info: {
    singularName: 'nap';
    pluralName: 'naps';
    displayName: 'nap';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    code: Attribute.String;
    address: Attribute.String;
    clients: Attribute.Relation<
      'api::nap.nap',
      'manyToMany',
      'api::client.client'
    >;
    neighborhood: Attribute.Relation<
      'api::nap.nap',
      'manyToOne',
      'api::neighborhood.neighborhood'
    >;
    city: Attribute.Relation<'api::nap.nap', 'manyToOne', 'api::city.city'>;
    technology: Attribute.Relation<
      'api::nap.nap',
      'manyToOne',
      'api::technology.technology'
    >;
    naptype: Attribute.Relation<
      'api::nap.nap',
      'manyToOne',
      'api::naptype.naptype'
    >;
    ports: Attribute.Integer;
    services: Attribute.Relation<
      'api::nap.nap',
      'manyToMany',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::nap.nap', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::nap.nap', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiNaptypeNaptype extends Schema.CollectionType {
  collectionName: 'naptypes';
  info: {
    singularName: 'naptype';
    pluralName: 'naptypes';
    displayName: 'naptype';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    ports: Attribute.Integer;
    naps: Attribute.Relation<
      'api::naptype.naptype',
      'oneToMany',
      'api::nap.nap'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::naptype.naptype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::naptype.naptype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNeighborhoodNeighborhood extends Schema.CollectionType {
  collectionName: 'neighborhoods';
  info: {
    singularName: 'neighborhood';
    pluralName: 'neighborhoods';
    displayName: 'neighborhood';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    clients: Attribute.Relation<
      'api::neighborhood.neighborhood',
      'oneToMany',
      'api::client.client'
    >;
    cities: Attribute.Relation<
      'api::neighborhood.neighborhood',
      'manyToMany',
      'api::city.city'
    >;
    naps: Attribute.Relation<
      'api::neighborhood.neighborhood',
      'oneToMany',
      'api::nap.nap'
    >;
    addresses: Attribute.Relation<
      'api::neighborhood.neighborhood',
      'oneToMany',
      'api::address.address'
    >;
    service_addresses: Attribute.Relation<
      'api::neighborhood.neighborhood',
      'oneToMany',
      'api::service-address.service-address'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::neighborhood.neighborhood',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::neighborhood.neighborhood',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNormalizedClientNormalizedClient
  extends Schema.CollectionType {
  collectionName: 'normalized_clients';
  info: {
    singularName: 'normalized-client';
    pluralName: 'normalized-clients';
    displayName: 'normalized-client';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    dni: Attribute.String;
    name: Attribute.String;
    phone: Attribute.String;
    email: Attribute.String;
    operator: Attribute.Relation<
      'api::normalized-client.normalized-client',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    services: Attribute.Relation<
      'api::normalized-client.normalized-client',
      'oneToMany',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::normalized-client.normalized-client',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::normalized-client.normalized-client',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOfferOffer extends Schema.CollectionType {
  collectionName: 'offers';
  info: {
    singularName: 'offer';
    pluralName: 'offers';
    displayName: 'offer';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    price: Attribute.Integer;
    currency: Attribute.String & Attribute.DefaultTo<'COP'>;
    clients: Attribute.Relation<
      'api::offer.offer',
      'oneToMany',
      'api::client.client'
    >;
    plan: Attribute.Relation<'api::offer.offer', 'manyToOne', 'api::plan.plan'>;
    affiliation_price: Attribute.Integer;
    debtmovements: Attribute.Relation<
      'api::offer.offer',
      'oneToMany',
      'api::debtmovement.debtmovement'
    >;
    offermovements: Attribute.Relation<
      'api::offer.offer',
      'oneToMany',
      'api::offermovement.offermovement'
    >;
    invoices: Attribute.Relation<
      'api::offer.offer',
      'oneToMany',
      'api::invoice.invoice'
    >;
    city: Attribute.String;
    clienttype: Attribute.String;
    services: Attribute.Relation<
      'api::offer.offer',
      'oneToMany',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::offer.offer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::offer.offer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOffermovementOffermovement extends Schema.CollectionType {
  collectionName: 'offermovements';
  info: {
    singularName: 'offermovement';
    pluralName: 'offermovements';
    displayName: 'offermovement';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    offer: Attribute.Relation<
      'api::offermovement.offermovement',
      'manyToOne',
      'api::offer.offer'
    >;
    client: Attribute.Relation<
      'api::offermovement.offermovement',
      'manyToOne',
      'api::client.client'
    >;
    technician: Attribute.Relation<
      'api::offermovement.offermovement',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    details: Attribute.String;
    service: Attribute.Relation<
      'api::offermovement.offermovement',
      'manyToOne',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::offermovement.offermovement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::offermovement.offermovement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPasswordchangePasswordchange extends Schema.CollectionType {
  collectionName: 'passwordchanges';
  info: {
    singularName: 'passwordchange';
    pluralName: 'passwordchanges';
    displayName: 'passwordchange';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    old_password: Attribute.Text;
    new_password: Attribute.String;
    dni: Attribute.String;
    address: Attribute.String;
    client: Attribute.Relation<
      'api::passwordchange.passwordchange',
      'manyToOne',
      'api::client.client'
    >;
    active: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::passwordchange.passwordchange',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::passwordchange.passwordchange',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPlanPlan extends Schema.CollectionType {
  collectionName: 'plans';
  info: {
    singularName: 'plan';
    pluralName: 'plans';
    displayName: 'plan';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    mikrotik_name: Attribute.String;
    clients: Attribute.Relation<
      'api::plan.plan',
      'oneToMany',
      'api::client.client'
    >;
    mikrotik_bandwidth: Attribute.String;
    offers: Attribute.Relation<
      'api::plan.plan',
      'oneToMany',
      'api::offer.offer'
    >;
    services: Attribute.Relation<
      'api::plan.plan',
      'oneToMany',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::plan.plan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::plan.plan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPppoeEventPppoeEvent extends Schema.CollectionType {
  collectionName: 'pppoe_events';
  info: {
    singularName: 'pppoe-event';
    pluralName: 'pppoe-events';
    displayName: 'pppoe-event';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    type: Attribute.String & Attribute.DefaultTo<'indeterminate'>;
    client: Attribute.Relation<
      'api::pppoe-event.pppoe-event',
      'manyToOne',
      'api::client.client'
    >;
    service: Attribute.Relation<
      'api::pppoe-event.pppoe-event',
      'manyToOne',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pppoe-event.pppoe-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pppoe-event.pppoe-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceService extends Schema.CollectionType {
  collectionName: 'services';
  info: {
    singularName: 'service';
    pluralName: 'services';
    displayName: 'service';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    code: Attribute.String;
    client: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::client.client'
    >;
    clienttype: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::clienttype.clienttype'
    >;
    offer: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::offer.offer'
    >;
    technology: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::technology.technology'
    >;
    city: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::city.city'
    >;
    service_addresses: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::service-address.service-address'
    >;
    mac_addresses: Attribute.Relation<
      'api::service.service',
      'manyToMany',
      'api::device.device'
    >;
    naps: Attribute.Relation<
      'api::service.service',
      'manyToMany',
      'api::nap.nap'
    >;
    plan: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::plan.plan'
    >;
    tickets: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::ticket.ticket'
    >;
    debtmovements: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::debtmovement.debtmovement'
    >;
    offermovements: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::offermovement.offermovement'
    >;
    monthlybills: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::monthlybill.monthlybill'
    >;
    tvspec: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'api::tvspec.tvspec'
    >;
    stratum: Attribute.Integer;
    invoices: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::invoice.invoice'
    >;
    opticalpower: Attribute.Integer;
    signed: Attribute.Boolean;
    signature: Attribute.String;
    corporate: Attribute.Boolean;
    pppoe_events: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::pppoe-event.pppoe-event'
    >;
    legal_notes: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::legal-note.legal-note'
    >;
    normalized_client: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::normalized-client.normalized-client'
    >;
    wifi_ssid: Attribute.String;
    wifi_password: Attribute.String;
    newModel: Attribute.Integer;
    ipmodel: Attribute.Integer;
    balance: Attribute.Integer;
    billingmonth: Attribute.Integer;
    billingyear: Attribute.Integer;
    active: Attribute.Boolean;
    indebt: Attribute.Boolean;
    address: Attribute.String;
    neighborhood: Attribute.String;
    client_name: Attribute.String;
    dni: Attribute.String;
    phone: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceAddressServiceAddress extends Schema.CollectionType {
  collectionName: 'service_addresses';
  info: {
    singularName: 'service-address';
    pluralName: 'service-addresses';
    displayName: 'service-address';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    address: Attribute.String;
    neighborhood: Attribute.Relation<
      'api::service-address.service-address',
      'manyToOne',
      'api::neighborhood.neighborhood'
    >;
    service: Attribute.Relation<
      'api::service-address.service-address',
      'manyToOne',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service-address.service-address',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service-address.service-address',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStaticipStaticip extends Schema.CollectionType {
  collectionName: 'staticips';
  info: {
    singularName: 'staticip';
    pluralName: 'staticips';
    displayName: 'staticip';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cidr: Attribute.String;
    network: Attribute.String;
    host: Attribute.String;
    broadcast: Attribute.String;
    gateway: Attribute.String;
    client: Attribute.Relation<
      'api::staticip.staticip',
      'oneToOne',
      'api::client.client'
    >;
    device: Attribute.Relation<
      'api::staticip.staticip',
      'oneToOne',
      'api::device.device'
    >;
    city: Attribute.Relation<
      'api::staticip.staticip',
      'manyToOne',
      'api::city.city'
    >;
    mask: Attribute.String;
    technician: Attribute.Relation<
      'api::staticip.staticip',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::staticip.staticip',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::staticip.staticip',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTechnologyTechnology extends Schema.CollectionType {
  collectionName: 'technologies';
  info: {
    singularName: 'technology';
    pluralName: 'technologies';
    displayName: 'technology';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    clients: Attribute.Relation<
      'api::technology.technology',
      'oneToMany',
      'api::client.client'
    >;
    naps: Attribute.Relation<
      'api::technology.technology',
      'oneToMany',
      'api::nap.nap'
    >;
    services: Attribute.Relation<
      'api::technology.technology',
      'oneToMany',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::technology.technology',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::technology.technology',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTelegrambotTelegrambot extends Schema.CollectionType {
  collectionName: 'telegrambots';
  info: {
    singularName: 'telegrambot';
    pluralName: 'telegrambots';
    displayName: 'telegrambot';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    token: Attribute.String;
    chat: Attribute.String;
    name: Attribute.String;
    binnacle: Attribute.String;
    log: Attribute.String;
    city: Attribute.Relation<
      'api::telegrambot.telegrambot',
      'manyToOne',
      'api::city.city'
    >;
    tvchat: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::telegrambot.telegrambot',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::telegrambot.telegrambot',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTicketTicket extends Schema.CollectionType {
  collectionName: 'tickets';
  info: {
    singularName: 'ticket';
    pluralName: 'tickets';
    displayName: 'ticket';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    details: Attribute.Text;
    answered: Attribute.Boolean & Attribute.DefaultTo<false>;
    escalated: Attribute.Boolean;
    client: Attribute.Relation<
      'api::ticket.ticket',
      'manyToOne',
      'api::client.client'
    >;
    city: Attribute.Relation<
      'api::ticket.ticket',
      'manyToOne',
      'api::city.city'
    >;
    tickettype: Attribute.Relation<
      'api::ticket.ticket',
      'manyToOne',
      'api::tickettype.tickettype'
    >;
    assignated: Attribute.Relation<
      'api::ticket.ticket',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    ticketdetails: Attribute.Relation<
      'api::ticket.ticket',
      'oneToMany',
      'api::ticketdetail.ticketdetail'
    >;
    clienttype: Attribute.Relation<
      'api::ticket.ticket',
      'manyToOne',
      'api::clienttype.clienttype'
    >;
    escalatedoffice: Attribute.Boolean;
    channel: Attribute.String;
    reboot: Attribute.Boolean;
    network: Attribute.Boolean;
    on: Attribute.Boolean;
    tvspec: Attribute.Relation<
      'api::ticket.ticket',
      'oneToOne',
      'api::tvspec.tvspec'
    >;
    technician: Attribute.Relation<
      'api::ticket.ticket',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    opticalpower: Attribute.Integer;
    signed: Attribute.Boolean & Attribute.DefaultTo<false>;
    signature: Attribute.String;
    media: Attribute.Media;
    time: Attribute.DateTime;
    service: Attribute.Relation<
      'api::ticket.ticket',
      'manyToOne',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ticket.ticket',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ticket.ticket',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTicketdetailTicketdetail extends Schema.CollectionType {
  collectionName: 'ticketdetails';
  info: {
    singularName: 'ticketdetail';
    pluralName: 'ticketdetails';
    displayName: 'ticketdetail';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    details: Attribute.Text;
    ticket: Attribute.Relation<
      'api::ticketdetail.ticketdetail',
      'manyToOne',
      'api::ticket.ticket'
    >;
    operator: Attribute.Relation<
      'api::ticketdetail.ticketdetail',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    tvspec: Attribute.Relation<
      'api::ticketdetail.ticketdetail',
      'oneToOne',
      'api::tvspec.tvspec'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ticketdetail.ticketdetail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ticketdetail.ticketdetail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTickettypeTickettype extends Schema.CollectionType {
  collectionName: 'tickettypes';
  info: {
    singularName: 'tickettype';
    pluralName: 'tickettypes';
    displayName: 'tickettype';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    tickets: Attribute.Relation<
      'api::tickettype.tickettype',
      'oneToMany',
      'api::ticket.ticket'
    >;
    clienttypes: Attribute.Relation<
      'api::tickettype.tickettype',
      'manyToMany',
      'api::clienttype.clienttype'
    >;
    requireverification: Attribute.Boolean & Attribute.DefaultTo<false>;
    requiresextrainfo: Attribute.Boolean;
    requiresvisit: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tickettype.tickettype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tickettype.tickettype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTvspecTvspec extends Schema.CollectionType {
  collectionName: 'tvspecs';
  info: {
    singularName: 'tvspec';
    pluralName: 'tvspecs';
    displayName: 'tvspec';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    high: Attribute.Integer & Attribute.DefaultTo<0>;
    down: Attribute.Integer & Attribute.DefaultTo<0>;
    tvspectype: Attribute.Relation<
      'api::tvspec.tvspec',
      'manyToOne',
      'api::tvspectype.tvspectype'
    >;
    client: Attribute.Relation<
      'api::tvspec.tvspec',
      'oneToOne',
      'api::client.client'
    >;
    tvs: Attribute.Integer;
    notvs: Attribute.Boolean;
    ticketdetail: Attribute.Relation<
      'api::tvspec.tvspec',
      'oneToOne',
      'api::ticketdetail.ticketdetail'
    >;
    ticket: Attribute.Relation<
      'api::tvspec.tvspec',
      'oneToOne',
      'api::ticket.ticket'
    >;
    service: Attribute.Relation<
      'api::tvspec.tvspec',
      'oneToOne',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tvspec.tvspec',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tvspec.tvspec',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTvspectypeTvspectype extends Schema.CollectionType {
  collectionName: 'tvspectypes';
  info: {
    singularName: 'tvspectype';
    pluralName: 'tvspectypes';
    displayName: 'tvspectype';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    tvspecs: Attribute.Relation<
      'api::tvspectype.tvspectype',
      'oneToMany',
      'api::tvspec.tvspec'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tvspectype.tvspectype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tvspectype.tvspectype',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiVlanVlan extends Schema.CollectionType {
  collectionName: 'vlans';
  info: {
    singularName: 'vlan';
    pluralName: 'vlans';
    displayName: 'vlan';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    vlan: Attribute.Integer & Attribute.DefaultTo<1>;
    clients: Attribute.Relation<
      'api::vlan.vlan',
      'oneToMany',
      'api::client.client'
    >;
    city: Attribute.Relation<'api::vlan.vlan', 'manyToOne', 'api::city.city'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::vlan.vlan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::vlan.vlan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiWhatsappWhatsapp extends Schema.CollectionType {
  collectionName: 'whatsapps';
  info: {
    singularName: 'whatsapp';
    pluralName: 'whatsapps';
    displayName: 'whatsapp';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    phone: Attribute.String;
    payload: Attribute.JSON;
    to: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::whatsapp.whatsapp',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::whatsapp.whatsapp',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWhatsappcontactWhatsappcontact
  extends Schema.CollectionType {
  collectionName: 'whatsappcontacts';
  info: {
    singularName: 'whatsappcontact';
    pluralName: 'whatsappcontacts';
    displayName: 'whatsappcontact';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    phone: Attribute.String;
    name: Attribute.String;
    lastwhatsapp: Attribute.Relation<
      'api::whatsappcontact.whatsappcontact',
      'oneToOne',
      'api::whatsapp.whatsapp'
    >;
    read: Attribute.Boolean & Attribute.DefaultTo<false>;
    lastmessage: Attribute.DateTime;
    pendingmessages: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::whatsappcontact.whatsappcontact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::whatsappcontact.whatsappcontact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWhatsappmediaWhatsappmedia extends Schema.CollectionType {
  collectionName: 'whatsappmedias';
  info: {
    singularName: 'whatsappmedia';
    pluralName: 'whatsappmedias';
    displayName: 'whatsappmedia';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    mediaid: Attribute.String;
    url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::whatsappmedia.whatsappmedia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::whatsappmedia.whatsappmedia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::address.address': ApiAddressAddress;
      'api::billingperiod.billingperiod': ApiBillingperiodBillingperiod;
      'api::city.city': ApiCityCity;
      'api::client.client': ApiClientClient;
      'api::clienttype.clienttype': ApiClienttypeClienttype;
      'api::component.component': ApiComponentComponent;
      'api::debtmovement.debtmovement': ApiDebtmovementDebtmovement;
      'api::device.device': ApiDeviceDevice;
      'api::devicebrand.devicebrand': ApiDevicebrandDevicebrand;
      'api::devicebrandpart.devicebrandpart': ApiDevicebrandpartDevicebrandpart;
      'api::invoice.invoice': ApiInvoiceInvoice;
      'api::invoice-movement.invoice-movement': ApiInvoiceMovementInvoiceMovement;
      'api::invoice-type.invoice-type': ApiInvoiceTypeInvoiceType;
      'api::legal-note.legal-note': ApiLegalNoteLegalNote;
      'api::material.material': ApiMaterialMaterial;
      'api::materialhistory.materialhistory': ApiMaterialhistoryMaterialhistory;
      'api::materialhistorytype.materialhistorytype': ApiMaterialhistorytypeMaterialhistorytype;
      'api::materialquantity.materialquantity': ApiMaterialquantityMaterialquantity;
      'api::materialtype.materialtype': ApiMaterialtypeMaterialtype;
      'api::menu.menu': ApiMenuMenu;
      'api::mikrotik.mikrotik': ApiMikrotikMikrotik;
      'api::monthlybill.monthlybill': ApiMonthlybillMonthlybill;
      'api::nap.nap': ApiNapNap;
      'api::naptype.naptype': ApiNaptypeNaptype;
      'api::neighborhood.neighborhood': ApiNeighborhoodNeighborhood;
      'api::normalized-client.normalized-client': ApiNormalizedClientNormalizedClient;
      'api::offer.offer': ApiOfferOffer;
      'api::offermovement.offermovement': ApiOffermovementOffermovement;
      'api::passwordchange.passwordchange': ApiPasswordchangePasswordchange;
      'api::plan.plan': ApiPlanPlan;
      'api::pppoe-event.pppoe-event': ApiPppoeEventPppoeEvent;
      'api::service.service': ApiServiceService;
      'api::service-address.service-address': ApiServiceAddressServiceAddress;
      'api::staticip.staticip': ApiStaticipStaticip;
      'api::technology.technology': ApiTechnologyTechnology;
      'api::telegrambot.telegrambot': ApiTelegrambotTelegrambot;
      'api::ticket.ticket': ApiTicketTicket;
      'api::ticketdetail.ticketdetail': ApiTicketdetailTicketdetail;
      'api::tickettype.tickettype': ApiTickettypeTickettype;
      'api::tvspec.tvspec': ApiTvspecTvspec;
      'api::tvspectype.tvspectype': ApiTvspectypeTvspectype;
      'api::vlan.vlan': ApiVlanVlan;
      'api::whatsapp.whatsapp': ApiWhatsappWhatsapp;
      'api::whatsappcontact.whatsappcontact': ApiWhatsappcontactWhatsappcontact;
      'api::whatsappmedia.whatsappmedia': ApiWhatsappmediaWhatsappmedia;
    }
  }
}
