                                     Table "public.images"
  Column   |          Type          | Collation | Nullable |              Default               
-----------+------------------------+-----------+----------+------------------------------------
 id        | integer                |           | not null | nextval('images_id_seq'::regclass)
 name      | character varying(100) |           | not null | 
 public_id | integer                |           | not null | 
 type      | character varying(50)  |           | not null | 
 url       | text                   |           | not null | 
 projectId | integer                |           | not null | 
Indexes:
    "images_pkey" PRIMARY KEY, btree (id)
    "images_name_projectId_key" UNIQUE, btree (name, "projectId")
    "images_public_id_key" UNIQUE, btree (public_id)
Foreign-key constraints:
    "images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE

