import Dexie from "dexie";

export class TopoDb extends Dexie {
  TopoImages: Dexie.Table<ITopoImage, number>;
  
  constructor() {  
    super("TopoDB");
    
    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
      TopoImages: '++id, data',
      // emails: '++id, contactId, type, email',
      // phones: '++id, contactId, type, phone',
    });
    
    // The following lines are needed for it to work across typescipt using babel-preset-typescript:
    this.TopoImages = this.table("TopoImages");
  }

  // loadEmailsAndPhones() {
  //   return Promise.all(
  //       db.emails
  //       .where('contactId').equals(this.id)
  //       .toArray(emails => this.emails = emails),
  //       db.phones
  //       .where('contactId').equals(this.id)
  //       .toArray(phones => this.phones = phones) 
  //     )
  //     .then(x => this);
  // }
  
  // save() {
  //   return db.transaction('rw', db.contacts, db.emails, db.phones, () => {
  //     return Promise.all(
  //       // Save existing arrays
  //       Promise.all(this.emails.map(email => db.emails.put(email))),
  //       Promise.all(this.phones.map(phone => db.phones.put(phone)))
  //     )
  //     .then(results => {
  //       // Remove items from DB that is was not saved here:
  //       var emailIds = results[0], // array of resulting primary keys
  //       phoneIds = results[1]; // array of resulting primary keys
        
  //       db.emails.where('contactId').equals(this.id)
  //         .and(email => emailIds.indexOf(email.id) === -1)
  //         .delete();
        
  //       db.phones.where('contactId').equals(this.id)
  //         .and(phone => phoneIds.indexOf(phone.id) === -1)
  //         .delete();
        
  //       // At last, save our own properties.
  //       // (Must not do put(this) because we would get
  //       // reduntant emails/phones arrays saved into db)
  //       db.contacts.put(new Contact(this.first, this.last, this.id))
  //         .then(id => this.id = id);
  //     });
  //   });
  // }
}





// By defining the interface of table records,
// you get better type safety and code completion
export interface ITopoImage {
  id?: number; // Primary key. Optional (autoincremented)
  data: string | ArrayBuffer; // First name
}